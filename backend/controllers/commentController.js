const Comment = require("../models/commentSchema");
async function addComment(req, res) {
  try {
    const { blogId, comment } = req.body;

    if (!comment) {
      return res.status(400).json({
        message: "vomment can not be empty",
      });
    }

    const newComment = await Comment.create({
      blogId,
      user: req.user,
      comment,
    });

    return res.status(200).json({
      message: "comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function getComments(req, res) {
  try {
    const { id } = req.params;
    const comments = await Comment.find({ blogId: id })
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .lean();
    return res.status(200).json({
      message: "Comments fetched success",
      comments,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message,
    });
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
    console.log(error);

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

    const count = Comment.countDocuments({ blogId });

    return res.status(200).json({ count });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}
module.exports = {
  addComment,
  getComments,
  editComment,
  deleteComment,
  getCommentCount,
};
