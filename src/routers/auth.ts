import express from "express";
import {
  register,
  login,
  getRegisterPage,
  getLoginPage,
  getForgotPasswordPage,
  sendForgotPasswodLink,
  getResetPasswordPage,
  resetPassword,
} from "../controllers/authController.js";
const router = express.Router();

router.route("/register").get(getRegisterPage).post(register);
router.route("/login").get(getLoginPage).post(login);
router
  .route("/forgot-password")
  .get(getForgotPasswordPage)
  .post(sendForgotPasswodLink);
router
  .route("/reset-password/:userId/:token")
  .get(getResetPasswordPage)
  .post(resetPassword);

export default router;
