import express from "express";
import {
  register,
  login,
  sendForgotPasswodLink,
  resetPassword,
} from "../controllers/authController.js";
const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/forgot-password").post(sendForgotPasswodLink);
router.route("/reset-password/:userId/:token").post(resetPassword);

export default router;
