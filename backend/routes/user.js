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
  addFriend,
  follow,
  unfollow,
  cancelRequest,
  acceptRequest,
  deleteRequest
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
router.put("/addFriend/:id",authUser,addFriend);
router.put("/cancelRequest/:id",authUser,cancelRequest);
router.put("/follow/:id",authUser,follow);
router.put("/unfollow/:id",authUser,unfollow);
router.put("/acceptRequest/:id",authUser,acceptRequest);
router.put("/deleteRequest/:id",authUser,deleteRequest)

module.exports = router;
