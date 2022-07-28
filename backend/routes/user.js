const express = require("express");

//The express.Router() function is used to create a new router object. 
//This function is used when you want to create a new router object in your program to handle requests.
//Multiple requests can be easily differentiated with the help of the Router() function in Express.js.This is the advantage of the use of the Router.


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
  deleteRequest,
  getProfile
} = require("../controllers/user.js");

const { authUser } = require("../middlewares/auth.js");

router.post("/register", register);
router.post("/activate", activateAccount);
router.post("/login", login);

/*************These all work on backend , on frontend its only /reset *************/
router.post("/auth", authUser, auth);
router.post("/sendVerification", authUser, sendVerification);
router.post("/findUser", findUser);
router.post("/sendResetPasswordCode", sendResetPasswordCode);
router.post("/validateResetCode", validateResetCode);
router.post("/changePassword", changePassword);
/*********************************************************************************/

router.get("/getProfile/:username", authUser, getProfile);
router.put("/addFriend/:id", authUser, addFriend);
router.put("/cancelRequest/:id", authUser, cancelRequest);
router.put("/follow/:id", authUser, follow);
router.put("/unfollow/:id", authUser, unfollow);
router.put("/acceptRequest/:id", authUser, acceptRequest);
router.put("/deleteRequest/:id", authUser, deleteRequest);


module.exports = router;
