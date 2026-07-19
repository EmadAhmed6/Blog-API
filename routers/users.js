const express = require("express");
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  uploadUserPicture,
} = require("../controllers/userController");
const {
  verifyToken,
  verifyAuthorizedToken,
  verifyAdminToken,
} = require("../middlewares/verifyToken");
const upload = require("../middlewares/multer");
const router = express.Router();

router.post(
  "/:id/upload",
  verifyAuthorizedToken,
  upload.single("profilePicture"),
  uploadUserPicture,
);

router.route("/").get(verifyToken, getAllUsers);

router
  .route("/:id")
  .get(verifyToken, getUserById)
  .put(verifyAuthorizedToken, updateUser)
  .delete(verifyAdminToken, deleteUser);

module.exports = router;
