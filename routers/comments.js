const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getAllComments,
  updateComment,
  createComment,
  deleteComment,
  likeComment,
  uploadCommentImage,
} = require("../controllers/commentController");
const {
  verifyToken,
  verifyAdminToken,
  verifyAuthorizedToken,
  verifyCommentOwner,
} = require("../middlewares/verifyToken");
const upload = require("../middlewares/multer");
router
  .route("/")
  .get(verifyToken, getAllComments)
  .post(verifyToken, createComment);

router
  .route("/:id")
  .put(verifyCommentOwner, updateComment)
  .delete(verifyCommentOwner, deleteComment);

router.post(
  "/:commentId/upload",
  verifyCommentOwner,
  upload.single("image"),
  uploadCommentImage,
);

router.put("/:commentId/like", verifyToken, likeComment);

module.exports = router;
