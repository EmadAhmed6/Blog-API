const express = require('express');
const router = express.Router();
const { getAllPosts, getPostById, updatePost, deletePost } = require('../controllers/postController');
const {
  verifyAdminToken,
} = require("../middlewares/verifyToken");

module.exports = router;