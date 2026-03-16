const path = require("path");
const Blog = require("../models/blogSchema");
const Comment = require("../models/commentSchema");
const User = require("../models/userSchema");
const { verifyJWT } = require("../utils/generateToken");
const {
  uploadImage,
  deleteImagefromCloudinary,
} = require("../utils/uploadImage");
const fs = require("fs");
const uniqid = require("uniqid");

async function createBlog(req, res) {
  try {
    // 🔐 AUTHTICATION
    const token = req.headers.authorization?.split(" ")[1];
    const isValid = await verifyJWT(token);

    if (!isValid) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const creator = isValid.id;

    // 📦 BODY
    const { title, description } = req.body;
    const draft = req.body.draft === "true";

    const content = JSON.parse(req.body.content);
    const tags = JSON.parse(req.body.tags);

    if (!title) {
      return res.status(400).json({
        message: "Please add title field",
      });
    }

    if (!description) {
      return res.status(400).json({
        message: "Please add description field",
      });
    }

    if (!content) {
      return res.status(400).json({
        message: "Please add some content",
      });
    }

    // 🧾 PARSE TIPTAP CONTENT  (TEXT ONLY)

    // try {
    //   content = JSON.parse(req.body.content);
    // } catch (error) {
    //   console.log(error);
    // }

    // 🖼️ COVER IMAGE (SINGLE FILE)
    const coverImage = req.file;

    // ❗ COVER IMAGE IS REQUIRED
    if (!coverImage || !coverImage.buffer) {
      return res.status(400).json({
        message: "Cover image is required",
      });
    }

    // UPLOAD COVER IMAGE
    const uploadResult = await uploadImage(coverImage.buffer);
    if (!uploadResult) {
      return res.status(500).json({
        message: "Cover image upload failed",
      });
    }

    const coverImageUrl = uploadResult.secure_url;
    const coverImageId = uploadResult.public_id;

    //remove temp file

    // BLOG ID
    const blogId =
      title.toLowerCase().trim().split(" ").join("-") + "-" + uniqid();

    // ============================
    // 📝 SAVE BLOG
    // ============================

    const blog = await Blog.create({
      title,
      description,
      draft,
      creator,
      blogId,
      image: coverImageUrl,
      imageId: coverImageId,
      content, //TIPTAP JSON (text only)
      tags,
    });

    await User.findByIdAndUpdate(creator, {
      $push: { blogs: blog._id },
    });

    if (draft) {
      console.log(draft);
      return res.status(200).json({
        message: "Blog save as draft.You can public it from your profile",
      });
    }
    return res.status(201).json({
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function getBlogs(req, res) {
  try {
    // const blogs=await Blog.find({draft:false}).populate("creator")
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const skip = (page - 1) * limit;

    const blogs = await Blog.find({ draft: false })
      .populate({
        path: "creator",
        select: "-password",
      })
      .populate({
        path: "likes",
        select: "email name",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalBlogs = await Blog.countDocuments({ draft: false });

    return res.status(200).json({
      message: "Blogs fetch successfully",
      blogs,
      hasMore: skip + limit < totalBlogs,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}
async function getBlog(req, res) {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findOne({ blogId })
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .populate({
        path: "creator",
        select: "name email followers username",
      })
      .lean();

    async function populateReplies(comments) {
      for (const comment of comments) {
        let populatedComment = await Comment.findById(comment._id)
          .populate({
            path: "replies",
            populate: {
              path: "user",
              select: "name email",
            },
          })
          .lean();

        comment.replies = populatedComment.replies;
        if (comment.replies.length > 0) {
          await populateReplies(comment.replies);
        }
      }
      return comments;
    }
    blog.comments = await populateReplies(blog.comments);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    //FOR REPLIES
    const comments = await Comment.find({
      blogId: blog._id,
      parentComment: null,
    });

    return res.status(200).json({
      message: "Blog fetch successfully",
      blog,
      comments,
    });
  } catch (error) {
    console.log(error);
  }
}

async function updateBlog(req, res) {
  try {
    const blogId = req.params.id;
    // 🔐 AUTHTICATION
    const token = req.headers.authorization?.split(" ")[1];
    const isValid = await verifyJWT(token);

    if (!isValid) {
      res.status(401).json({
        message: "Invalid token",
      });
    }

    //find the blog using blogId
    console.log("Searching for blog..");
    const blog = await Blog.findOne({ blogId });
    console.log(blog);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // only creator of the blog, can be update the blog
    if (blog.creator.toString() !== isValid.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { title, description } = req.body;
    if (!title || !description || !req.body.content) {
      return res.status(400).json({
        message: "title,description and content required",
      });
    }
    const tags = JSON.parse(req.body.tags);
    let content; //TIPTAP text

    try {
      content = JSON.parse(req.body.content);
    } catch (error) {
      return res.status(400).json({
        message: "Invalid content format",
      });
    }

    //HANDLE COVER IMAGE
    const newImage = req.file;
    let imageUrl = blog.image;
    let imageId = blog.imageId;

    if (newImage && newImage.path) {
      //delete old image from cloudinary

      if (blog.imageId) {
        await deleteImagefromCloudinary(blog.imageId);
      }

      const uploadResult = await uploadImage(newImage.path);

      if (!uploadImage) {
        fs.unlinkSync(newImage.path);
        return res.status(500).json({
          message: "Image upload failed",
        });
      }

      imageUrl = uploadResult.secure_url;
      imageId = uploadResult.public_id;

      // remove temp file

      fs.unlinkSync(newImage.path);
    }

    // =========================
    // 📝 Update Blog
    // =========================

    blog.title = title;
    blog.description = description;
    blog.content = content;
    blog.image = imageUrl;
    blog.imageId = imageId;
    blog.tags = tags || blog.tags;
    await blog.save();

    return res.status(200).json({
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function likeBlog(req, res) {
  try {
    const user = req.user.id;
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(500).json({
        message: "Blog is not found",
      });
    }

    if (!blog.likes.includes(user)) {
      await Blog.findByIdAndUpdate(id, { $push: { likes: user } });
      await User.findByIdAndUpdate(user, { $push: { likeBlogs: id } });

      return res.status(200).json({
        success: true,
        message: "Blog Liked successfully",
        isLiked: true,
      });
    } else {
      await Blog.findByIdAndUpdate(id, { $pull: { likes: user } });

      await User.findByIdAndUpdate(user, { $pull: { likeBlogs: id } });

      return res.status(200).json({
        success: true,
        message: "Blog DisLiked successfully",
        isLiked: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function dislikeBlog(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const blog = Blog.findById(id);
    if (!blog) {
      return res.json({
        message: "Blog not found",
      });
    }

    //if already dislike remove dislike
    if (blog.dislikes.includes(userId)) {
      await Blog.findByIdAndUpdate(id, {
        $pull: { dislikes: userId },
      });
      return res.json({
        message: "dislike removed",
      });
    }

    //remove like

    await Blog.findByIdAndUpdate(id, {
      $pull: { likes: userId },
    });

    await Blog.findByIdAndUpdate(id, {
      $addToSet: { dislikes: userId },
    });
    return res.json({
      message: "dislike added",
    });
  } catch (error) {
    return res.json({
      message: error.message,
    });
  }
}

async function deleteBlog(req, res) {
  try {
    const creator = req.user;
    console.log("Creator:", creator);

    const { id } = req.params;

    const blog = Blog.findById(id);
    if (!blog) {
      return res.status(500).json({
        success: false,
        message: "blog not found",
      });
    }
    if (!blog.creator.equals(creator)) {
      return res.status(500).json({
        message: "You are not authorized for this action",
      });
    }
    await deleteImagefromCloudinary(blog.imageId);

    // 1. Delete the blog
    await Blog.findByIdAndDelete(id);

    // 2. Remove it from the user's blogs list
    await User.findByIdAndUpdate(creator, { $pull: { blogs: id } });

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.log("DELETE ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function saveBlog(req, res) {
  try {
    const user = req.user.id;
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(500).json({
        message: "Blog is not found",
      });
    }

    if (!blog.totalSaves.includes(user)) {
      await Blog.findByIdAndUpdate(id, { $set: { totalSaves: user } });
      await User.findByIdAndUpdate(user, { $set: { saveBlogs: id } });

      return res.status(200).json({
        success: true,
        message: "Blog has been saved successfully",
      });
    } else {
      await Blog.findByIdAndUpdate(id, { $unset: { totalSaves: user } });

      await User.findByIdAndUpdate(user, { $unset: { saveBlogs: id } });

      return res.status(200).json({
        success: true,
        message: "Removed from saved blogs",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function searchBlog(req, res) {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const skip = (page - 1) * limit;
    const { search } = req.query;
    const query = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    };
    const blogs = await Blog.find(query, { draft: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalBlogs = await Blog.countDocuments(query, { draft: false });
    if (blogs.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Make sure all words are spelled correctly.Try different keywords.Try more general keywords.",
      });
    }

    return res.status(200).json({
      success: true,
      blogs,
      hasMore: skip + limit < totalBlogs,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  dislikeBlog,
  saveBlog,
  searchBlog,
};

//(req,res)=>{
//   blogs.push({...req.body,id:blogs.length+1})
//     return res.json({message:"blog created successfully"})

// }
