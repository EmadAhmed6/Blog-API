const express = require("express");
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const {
  verifyToken,
  verifyAuthorizedToken,
  verifyAdminToken,
} = require("../middlewares/verifyToken");
const router = express.Router();
router.route("/").get(verifyToken, getAllUsers);
router
  .route("/:id")
  .get(verifyToken, getUserById)
  .put(verifyAuthorizedToken, updateUser)
  .delete(verifyAdminToken, deleteUser);

module.exports = router;
