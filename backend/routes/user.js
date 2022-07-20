const express = require("express");
const router = express.Router();
const {
  register,
  activateAccount,
  login,
  auth,
  sendVerification,
  findUser,
  sendResetPasswordCode,
  validateResetCode,
  changePassword,
} = require("../controllers/user.js");
const { authUser } = require("../middlewares/auth.js");

router.post("/register", register);
router.post("/activate", activateAccount);
router.post("/login", login);
router.post("/auth", authUser, auth);
router.post("/sendVerification", authUser, sendVerification);
router.post("/findUser", findUser);
router.post("/sendResetPasswordCode", sendResetPasswordCode);
router.post("/validateResetCode", validateResetCode);
router.post("/changePassword", changePassword);

module.exports = router;
