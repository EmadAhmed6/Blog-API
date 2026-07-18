const express = require("express");
const router = express.Router();
const comments = require("./comments");
const {
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  createPost,
  likePost,
} = require("../controllers/postController");
const {
  verifyAdminToken,
  verifyAuthorizedToken,
} = require("../middlewares/verifyToken");

router.route("/").get(getAllPosts).post(verifyAuthorizedToken, createPost);
router
  .route("/:id")
  .get(verifyAuthorizedToken, getPostById)
  .put(verifyAuthorizedToken, updatePost)
  .delete(verifyAuthorizedToken, deletePost);

router.put("/:id/like", verifyAuthorizedToken, likePost);

router.use("/:postId/comments", comments);

module.exports = router;
