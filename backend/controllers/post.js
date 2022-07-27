const Post = require("../models/Post");
const User = require("../models/User")

exports.createPost = async (req, res) => {
  try {
    const post = await new Post(req.body).save();
    res.json(post);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// exports.getAllPosts = async (req, res) => {
//   try {
//     console.log("###################################",req.user,"####################################");
//     const posts = await Post.find().populate("user","first_name last_name picture username gender").sort({createdAt:-1});
//     // sort by created at -1 means in descending order (from latest to oldest)
//     // by using populate we can access user fields in post
//     res.json(posts);
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// }

exports.getAllPosts = async (req, res) => {
  try {
    const followingTemp = await User.findById(req.user.id).select("following");
    const following = followingTemp.following;
    const promises = following.map((user) => {
      return Post.find({ user: user })
        .populate("user", "first_name last_name picture username cover") //ObjectId is populated
        .populate("comments.commentBy", "first_name last_name picture username") //ObjectId is populated
        .sort({ createdAt: -1 })
        .limit(10);
    });
    const followingPosts = await (await Promise.all(promises)).flat();
    const userPosts = await Post.find({ user: req.user.id })
      .populate("user", "first_name last_name picture username cover")
      .populate("comments.commentBy", "first_name last_name picture username")
      .sort({ createdAt: -1 })
      .limit(10);
    followingPosts.push(...[...userPosts]);
    followingPosts.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });
    res.json(followingPosts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    await Post.findByIdAndRemove(req.params.id);
    res.json({ status: "ok" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};