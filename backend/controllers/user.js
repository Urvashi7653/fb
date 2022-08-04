const User = require("../models/User");
const Post = require("../models/Post");
const Code = require("../models/Code");
require("dotenv").config();
const {
  validateEmail,
  validateLength,
  validateUsername,
} = require("../helpers/validation");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../helpers/tokens");
const { sendVerificationEmail, sendResetCode } = require("../helpers/mailer");
const { BASE_URL, JWT_TOKEN_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const generateCode = require("../helpers/generateCode");

//from
exports.register = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      gender,
      bYear,
      bMonth,
      bDay,
    } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({
        message: "Invalid email address",
      });
    }

    if (!validateLength(first_name, 2, 30)) {
      return res.status(400).json({
        message: "First name should be between 2 and 30 characters",
      });
    }

    if (!validateLength(last_name, 2, 30)) {
      return res.status(400).json({
        message: "Last name should be between 2 and 30 characters",
      });
    }

    if (!validateLength(password, 6, 30)) {
      return res.status(400).json({
        message: "Password should be between 6 and 30 characters",
      });
    }

    const cryptedpassword = await bcrypt.hash(password, 10);

    const check = await User.findOne({ email: email });
    if (check) {
      return res.status(400).json({
        message: "Email already in use",
      });
    }

    let tempUserName = first_name + last_name;
    let newUserName = await validateUsername(tempUserName);
    const user = await new User({
      first_name,
      last_name,
      username: newUserName,
      email,
      password: cryptedpassword,
      gender,
      bYear,
      bMonth,
      bDay,
    });

    user.save();
    const emailVerificationToken = generateToken(
      { id: user._id.toString() },
      "2d"
    );

    const url = `${BASE_URL}/activate/${emailVerificationToken}`;
    sendVerificationEmail(user.email, user.first_name, url);

    const token = generateToken({ id: user._id.toString() }, "7d");
    //EXCEPT MESSAGE,SAME IS SEND WHEN USER LOG IN
    res.send({
      id: user._id,
      user: user.username,
      picture: user.picture,
      first_name: user.first_name,
      last_name: user.last_name,
      token: token,
      verified: user.verified,
      message: "Registration successful. Kindly activate your account.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.activateAccount = async (req, res) => {
  try {
    const { token } = req.body;  
    const user = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    const check = await User.findById(user.id);
    if (check.verified === true) {
      return res.status(400).json({ message: "Email already activated" });
    } else {
      await User.findByIdAndUpdate(user.id, { verified: true });
      return res
        .status(200)
        .json({ message: "Account has been activated successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const check = await bcrypt.compare(password, user.password);
    if (!check) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    //everytime user login a new token is generated
    //check if everytime token is new or same
    const token = generateToken({ id: user._id.toString() }, "7d");
    // generated token bcz data send from login will be used to set Cookies in loginForm.js
    res.send({
      id: user._id,
      user: user.username,
      picture: user.picture,
      first_name: user.first_name,
      last_name: user.last_name,
      token: token,
      verified: user.verified,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.auth = (req, res) => {
  //console.log(req.user);
  res.json("Welcome from Auth");
};

//from components >> home>>sendverification
exports.sendVerification = async (req, res) => {
  try {
    const id = req.user.id;   
    const user = await User.findById(id);
    if (user.verified === true) {
      return res
        .status(400)
        .json({ message: "This account is already activated." });
    } else {
      const emailVerificationToken = generateToken(
        { id: user._id.toString() },
        "2d"
      );
      const url = `${BASE_URL}/activate/${emailVerificationToken}`;
      sendVerificationEmail(user.email, user.first_name, url);
      return res
        .status(200)
        .json({ message: "Email verification link has been sent." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//this function is needed while resetting password
//from reset>>searchaccount
exports.findUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email }).select("-password"); 
    if (!user) {
      return res.status(400).json({
        message: "Account does not exists.",
      });
    }
    return res.status(200).json({
      email: user.email,
      picture: user.picture,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//from reset>>SendEmail
exports.sendResetPasswordCode = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).select("-password");
    await Code.findOneAndRemove({ user: user._id });
    const code = generateCode(5);
    await new Code({
      code: code,
      user: user._id,
    }).save();
    sendResetCode(user.email, user.first_name, code);
    return res.status(200).json({
      message: "Password reset code has been sent to your email",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//
exports.validateResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    const Dbcode = await Code.findOne({ user: user._id });
    if (Dbcode.code !== code) {
      return res.status(400).json({
        message: "Verification code is wrong..",
      });
    }
    return res.status(200).json({ message: "ok" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//from reset >> changepassword
exports.changePassword = async (req, res) => {
  const { email, password } = req.body;

  const cryptedPassword = await bcrypt.hash(password, 10);
  await User.findOneAndUpdate(
    { email },
    {
      password: cryptedPassword,
    }
  );
  return res.status(200).json({ message: "ok" });
};

//from functions >> user in frontend
exports.addFriend = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(req.params.id);
      if (
        !receiver.requests.includes(sender._id) &&
        !receiver.friends.includes(sender._id)
      ) {
        await receiver.updateOne({
          $push: { requests: sender._id },
        });
        await receiver.updateOne({
          $push: { followers: sender._id },
        });
        await sender.updateOne({
          $push: { following: receiver._id },
        });
        res.json({ message: "Friend request sent!" });
      } else {
        return res.status(400).json({ message: "Request already sent!" });
      }
    } else {
      res.status(400).json({ message: "You can't send request to yourself." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//from functions >> user in frontend
exports.cancelRequest = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(req.params.id);
      if (
        receiver.requests.includes(sender._id) &&
        !receiver.friends.includes(sender._id)
      ) {
        await receiver.updateOne({
          $pull: { requests: sender._id },
        });
        await receiver.updateOne({
          $pull: { followers: sender._id },
        });
        await sender.updateOne({
          $pull: { following: receiver._id },
        });
        res.json({ message: "Request cancelled!" });
      } else {
        return res.status(400).json({ message: "Request already cancelled" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "You can't cancel request to yourself." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//from functions >> user in frontend
exports.follow = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(req.params.id);
      if (
        !receiver.followers.includes(sender._id) &&
        !sender.following.includes(receiver._id)
      ) {
        await receiver.updateOne({
          $push: { followers: sender._id },
        });
        await sender.updateOne({
          $push: { following: receiver._id },
        });
        res.json({ message: "Follow success" });
      } else {
        return res.status(400).json({ message: "Already following" });
      }
    } else {
      return res.status(400).json({ message: "You can't follow yourself." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//from functions >> user in frontend
exports.unfollow = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(req.params.id);
      if (
        receiver.followers.includes(sender._id) &&
        sender.following.includes(receiver._id)
      ) {
        await receiver.updateOne({
          $pull: { followers: sender._id },
        });
        await sender.updateOne({
          $pull: { following: receiver._id },
        });
        res.json({ message: "Unfollow success" });
      } else {
        return res.status(400).json({ message: "Already not following." });
      }
    } else {
      return res.status(400).json({ message: "You can't unfollow yourself." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//MODIFIED  
////from functions >> user in frontend
exports.acceptRequest = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const receiver = await User.findById(req.user.id);
      const sender = await User.findById(req.params.id);
      if (receiver.requests.includes(sender._id)) {
        await receiver.updateOne({
          $push: { friends: sender._id },
        });
        await sender.updateOne({
          $push: { friends: receiver._id },
        });
        await receiver.updateOne({
          $pull: { requests: sender._id },
        });
        res.json({ message: "Friend request accepted" });
      } else {
        return res.status(400).json({ message: "Already friends" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "You can't accept request from yourself" });
    }
  } catch (error) {
    return res.status(400).json({ message: error, message });
  }
};

//MODIFIED
//from functions >> user in frontend
exports.deleteRequest = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const receiver = User.findById(req.user.id);
      const sender = User.findById(req.params.id);
      if (receiver.requests.includes(sender._id)) {
        await receiver.updateOne({
          $pull: { requests: sender._id }
        });
        res.json({ message: "Friend request rejected" });
      }
      else{
        res.json({message: "Request does not exist!"})
      }
    } else {
      return res.status(400).json({ message: "You can't reject request from yourself" })
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

//from profile>>index.js (using useEffect())
exports.getProfile= async(req,res)=>{
  try {
    const {username} = req.params;
    const user = await User.findById(req.user.id);
    const profile = await User.findOne({username}).select("-password");
    const friendship = {
      friends: false,
      following: false,
      requestSent: false,
      requestReceived: false,
    };
     if(!profile){
     return res.json({ok:false});
    }

    if (
      user.friends.includes(profile._id) &&
      profile.friends.includes(user._id)
    ) {
      friendship.friends = true;
    }
    if (user.following.includes(profile._id)) {
      friendship.following = true;
    }
    if (user.requests.includes(profile._id)) {
      friendship.requestReceived = true;
    }
    if (profile.requests.includes(user._id)) {
      friendship.requestSent = true;
    }
    const posts = await Post.find({user:profile._id,approved:true}).populate("user").populate(
      "comments.commentBy",
      "first_name last_name picture username commentAt"
    );
    res.json({...profile.toObject(),posts,friendship});
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}