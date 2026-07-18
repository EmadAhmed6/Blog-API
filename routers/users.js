const express = require('express');
const { getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const {
  verifyAuthorizedToken,
} = require("../middlewares/verifyToken");
const router = express.Router();
router.route('/').get(getAllUsers);
router.route('/:id').get(verifyAuthorizedToken, getUserById).put(verifyAuthorizedToken, updateUser).delete(verifyAuthorizedToken, deleteUser);

module.exports = router;