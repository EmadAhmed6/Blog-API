const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getAllComments,
  updateComment,
  createComment,
  deleteComment,
} = require("../controllers/commentController");
const {
  verifyAdminToken,
  verifyAuthorizedToken,
} = require("../middlewares/verifyToken");

router
  .route("/")
  .get(getAllComments)
  .post(verifyAuthorizedToken, createComment);
router
  .route("/:id")
  .put(verifyAuthorizedToken, updateComment)
  .delete(verifyAuthorizedToken, deleteComment);

module.exports = router;
