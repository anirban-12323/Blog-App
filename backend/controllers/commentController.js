const Comment = require("../models/commentSchema");
const Blog = require("../models/blogSchema");
async function addComment(req, res) {
  try {
    const { blogId } = req.params;

    const { comment } = req.body;
    const creator = req.user.id;

    if (!comment) {
      return res.status(400).json({ message: "Please enter the comment" });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const newComment = await Comment.create({
      blogId: blogId, // FIXED
      user: creator,
      comment,
    }).then((comment) => {
      return comment.populate({
        path: "user",
        select: "name email",
      });
    });

    await Blog.findByIdAndUpdate(blogId, {
      $push: { comments: newComment._id },
      $inc: { commentsCount: 1 },
    });

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      newComment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getCommentsByBlog(req, res) {
  try {
    console.log("getCommentsByBlog running");
    const { blogId } = req.params;

    //FIND BLOG USING SLUG

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: "Blog bot found" });
    }

    //get cmments
    const comments = await Comment.find({
      blogId: blog._id,
      parentComment: null,
    })
      .populate("user", "name email")
      .populate({
        path: "replies",
        populate: {
          path: "user",
          select: "name email",
        },
      });

    return res.status(200).json({ comments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function likesComment(req, res) {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "comment is not found" });
    }

    const alreadyLiked = comment.likes.includes(userId);

    if (alreadyLiked) {
      //unlike
      comment.likes.pull(userId);
    } else {
      //like
      comment.likes.push(userId);
    }

    await comment.save();

    return res.status(200).json({
      message: alreadyLiked ? "comment unliked" : "comment liked",
      likesCount: comment.likes.length,
    });
  } catch (error) {
    // res.status(500).json({
    //   message: "Failed to like comment",
    // });

    console.log(error);
  }
}

async function editComment(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { updatedCommentContent } = req.body;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        message: "comment not found",
      });
    }

    // validation

    if (comment.user != userId) {
      return res.status(404).json({
        message: "You are not authorized to edit this comment",
      });
    }
    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      {
        comment: updatedCommentContent,
      },
      { new: true },
    ).then((comment) => {
      return comment.populate({
        path: "user",
        select: "name email",
      });
    });

    return res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      updatedComment,
    });
  } catch (error) {
    console.log(error);
  }
}

async function deleteComment(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const comment = await Comment.findById(id).populate({
      path: "blogId",
      select: "creator",
    });

    if (!comment) {
      return res.status(400).json({ message: "comment not found " });
    }

    if (comment.user != userId && comment.blogId.creator != userId) {
      return res.status(400).json({
        message: "you are not authorized",
      });
    }
    async function deleteCommentAndReplies(id) {
      let comment = await Comment.findById(id);

      for (let replyId of comment.replies) {
        await deleteCommentAndReplies(replyId);
      }
      if (comment.parentComment) {
        await Comment.findByIdAndUpdate(comment.parentComment, {
          $pull: { replies: id },
        });
      }
      await Comment.findByIdAndDelete(id);
    }
    await deleteCommentAndReplies(id);

    await Blog.findByIdAndUpdate(comment.blogId._id, {
      $pull: { comments: id },
    });
    res.status(200).json({
      success: true,
      message: "Comment delete successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function getCommentCount(req, res) {
  try {
    const { blogId } = req.params;

    const count = await Comment.countDocuments({ blogId });

    return res.status(200).json({ count });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
    //console.log(error);
  }
}

//ADD NESTED COMMENT
async function addNestedComment(req, res) {
  try {
    const userId = req.user.id;
    const { blogId, parentCommentId } = req.params;
    const { reply } = req.body;
    //get comment from parentCommentId
    const comment = await Comment.findById(parentCommentId);

    if (!comment) {
      return res.status(404).json({ message: "comment is not found" });
    }

    // get blog from blogId
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: "blog is not found" });
    }

    const newReply = await Comment.create({
      blogId: blogId,
      user: userId,
      comment: reply,
      parentComment: parentCommentId,
    }).then((reply) => {
      return reply.populate({
        path: "user",
        select: "name email",
      });
    });

    await Comment.findByIdAndUpdate(parentCommentId, {
      $push: {
        replies: newReply._id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "reply added successfully",
      newReply,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = {
  addComment,
  getCommentsByBlog,
  editComment,
  deleteComment,
  getCommentCount,
  likesComment,
  addNestedComment,
};
