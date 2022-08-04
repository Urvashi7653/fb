const Post = require("../models/Post");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.validateAdmin = async (req, res) => {
  try {
    const { password } = req.body;
    const adminPassword = await bcrypt.hash("12", 10)
    const check = await bcrypt.compare(password, adminPassword);
    if (!check) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    res.send({
      message: "Admin login successfull"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAdminPosts = async (req, res) => {
  try {
    const posts = await Post.find({ adminChecked: false })
      .populate("user", "first_name last_name picture username cover")
      .populate("comments.commentBy", "first_name last_name picture username")
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.approvePosts = async (req, res) => {
  try {
    const { postId, status } = req.body;
    if (status === true) {
      await Post.findByIdAndUpdate(postId, { approved: true, adminChecked: true })
    }
    else if (status === false) {
      await Post.findByIdAndUpdate(postId, { approved: false, adminChecked: true })
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message
    })
  }
}

exports.getStats = async (req, res) => {
  try {
    const numberOfUsers = await User.countDocuments();
    const numberOfPosts = await Post.countDocuments();
    const numberOfApprovedPosts = await Post.countDocuments({ approved: true });
    const tempApprovalRate = (numberOfApprovedPosts / numberOfPosts) * 100;
    const approvalRate = tempApprovalRate.toFixed(2);
    const numberOfPendingPosts= await Post.countDocuments({ adminChecked:false });
    res.send({
      numberOfUsers: numberOfUsers,
      numberOfPosts: numberOfPosts,
      numberOfApprovedPosts:numberOfApprovedPosts,
      approvalRate: approvalRate,
      numberOfPendingPosts:numberOfPendingPosts,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    })
  }
}