const User = require("../models/User");
require("dotenv").config();
const {
  validateEmail,
  validateLength,
  validateUsername,
} = require("../helpers/validation");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../helpers/tokens");
const { sendVerificationEmail } = require("../helpers/mailer");
const { BASE_URL, JWT_TOKEN_SECRET } = process.env;
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      username,
      email,
      password,
      gender,
      bYear,
      bMonth,
      bDate,
    } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({
        message: "Invalid email address",
      });
    }

    if (!validateLength(first_name, 3, 30)) {
      return res.status(400).json({
        message: "First name should be between 3 and 30 characters",
      });
    }

    if (!validateLength(last_name, 3, 30)) {
      return res.status(400).json({
        message: "Last name should be between 3 and 30 characters",
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
      bDate,
    });
    user.save();
    const emailVerificationToken = generateToken(
      { id: user._id.toString() },
      "2d"
    );
    const url = `${BASE_URL}/activate/${emailVerificationToken}`;
    sendVerificationEmail(user.email, user.first_name, url);
    const token = generateToken({ id: user._id.toString() }, "7d");
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
  //console.log(req.body);
};

exports.activateAccount = async (req, res) => {
  const { token } = req.body;
  const user = jwt.verify(token, JWT_TOKEN_SECRET);
  console.log(user);
  const check = await User.findById(user.id);
  if (check.verified== true){
    return res.status(400).json({message:"Email already activated"})
  }else{
    await User.findByIdAndUpdate(user.id,{verified:true})
    return res.status(200).json({message:"Account has been activated successfully"})
  }
};

exports.login = async (req,res) =>{
  try {
    const {email,password} = req.body;
    const user = await User.findOne({email})
    if(!user){
      return res.status(400).json({message:"User does not exist"})
    }
    const check = await bcrypt.compare(password,user.password)
    if(!check){
      return res.status(400).json({message:"Incorrect password"})
    }
    const token = generateToken({ id: user._id.toString() }, "7d");
    res.send({
      id: user._id,
      user: user.username,
      picture: user.picture,
      first_name: user.first_name,
      last_name: user.last_name,
      token: token,
      verified: user.verified,
      message: "LOGIN SUCCESSFUL.",
    });
  } catch (error) {
    res.status(500).json({message:error.message})
  }
}