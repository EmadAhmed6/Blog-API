const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getAllComments,
  updateComment,
  createComment,
  deleteComment,
} = require("../controllers/commentController");
const {
  verifyToken,
  verifyAdminToken,
  verifyAuthorizedToken,
  verifyCommentOwner,
} = require("../middlewares/verifyToken");

router
  .route("/")
  .get(verifyToken, getAllComments)
  .post(verifyToken, createComment);
router
  .route("/:id")
  .put(verifyCommentOwner, updateComment)
  .delete(verifyCommentOwner, deleteComment);

module.exports = router;
