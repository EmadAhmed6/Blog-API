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
  verifyToken,
  verifyAdminToken,
  verifyAuthorizedToken,
  verifyPostOwner,
} = require("../middlewares/verifyToken");
const upload = require("../middlewares/multer");
// Crud
router.route("/").get(verifyToken, getAllPosts).post(verifyToken, createPost);
router
  .route("/:id")
  .get(verifyToken, getPostById)
  .put(verifyPostOwner, updatePost)
  .delete(verifyPostOwner, deletePost);

router.put("/:id/like", verifyToken, likePost);

// Upload Image
router.post("/upload", verifyToken, upload.single("image"), uploadPostImage);

router.use("/:postId/comments", verifyToken, comments);

module.exports = router;
