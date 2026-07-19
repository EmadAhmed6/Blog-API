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
  uploadPostImage,
} = require("../controllers/postController");
const {
  verifyAdminToken,
  verifyAuthorizedToken,
} = require("../middlewares/verifyToken");
const upload = require("../middlewares/multer");

router.route("/").get(getAllPosts).post(verifyAuthorizedToken, createPost);
router
  .route("/:id")
  .get(verifyAuthorizedToken, getPostById)
  .put(verifyAuthorizedToken, updatePost)
  .delete(verifyAuthorizedToken, deletePost);

router.put("/:id/like", verifyAuthorizedToken, likePost);

router.use("/:postId/comments", comments);
router.post(
  "/upload",
  verifyAuthorizedToken,
  upload.single("image"),
  uploadPostImage,
);

module.exports = router;
