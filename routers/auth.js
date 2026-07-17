const express = require("express");
const {
  register,
  login,
  getRegisterPage,
  getLoginPage,
  getForgotPasswordPage,
  sendForgotPasswodLink,
  getResetPasswordPage,
  resetPassword,
} = require("../controllers/authController");
const router = express.Router();

router.route("/register").get(getRegisterPage).post(register);
router.route("/login").get(getLoginPage).post(login);
router.route('/forgot-password').get(getForgotPasswordPage).post(sendForgotPasswodLink);
router.route('/reset-password/:userId/:token').get(getResetPasswordPage).post(resetPassword)

module.exports = router;
