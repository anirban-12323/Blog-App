const Comment = require("../models/commentSchema");
async function addComment(req, res) {
  try {
    const { blogId } = req.params;
    const { comment } = req.body; // ✅ matches schema

    const userId = req.user.id; // ✅ from verifyUser middleware

    if (!comment) {
      return res.status(400).json({ message: "Comment is required" });
    }

    const newComment = await Comment.create({
      blogId,
      comment,
      user: userId,
    });

    res.status(201).json({
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getCommentsByBlog(req, res) {
  try {
    const { blogId } = req.params;

    const comments = await Comment.find({ blogId })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({ comments });
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
    const { commentId } = req.params;
    const { comment } = req.body;
    const userId = req.user.id;
    const exitingComment = await Comment.findById(commentId);
    if (!exitingComment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }
    if (exitingComment.user.id.toString() !== userId) {
      return res.status(403).json({
        message: "not authorized",
      });
    }
    exitingComment.comment = comment;
    await exitingComment.save();
    res.status(200).json({
      message: "comment updated successfully",
      comment: exitingComment,
    });
  } catch (error) {
    // console.log(error);

    return res.status(500).json({
      message: error.message,
    });
  }
}

async function deleteComment(req, res) {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;
    const existingComment = await Comment.findById(commentId);
    if (!existingComment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }
    if (existingComment.user.id.toString() !== userId) {
      return res.status(403).json({
        message: "not authorized",
      });
    }

    await existingComment.deleteOne();

    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
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

module.exports = {
  addComment,
  getCommentsByBlog,
  editComment,
  deleteComment,
  getCommentCount,
  likesComment,
};
