import express from "express";
import { register, login, sendForgotPasswodLink, resetPassword, verifyEmailOTP, } from "../controllers/authController.js";
const router = express.Router();
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/forgot-password").post(sendForgotPasswodLink);
router.route("/reset-password/:userId/:token").post(resetPassword);
router.post("/verify-otp", verifyEmailOTP);
export default router;
//# sourceMappingURL=auth.js.map