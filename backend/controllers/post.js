const Post = require("../models/Post");
const User = require("../models/User")

//from functions post in frontend
exports.createPost = async (req, res) => {
  try {
    const post = await new Post(req.body).save();
    res.json(post);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// from App.js
exports.getAllPosts = async (req, res) => {
  try {
    const followingTemp = await User.findById(req.user.id).select("following"); // we get user in request using middleware authUser
    const following = followingTemp.following;
    const promises = following.map((user) => {
      return Post.find({ user: user })
        .populate("user", "first_name last_name picture username cover") //ObjectId is populated
        .populate("comments.commentBy", "first_name last_name picture username") //ObjectId is populated
        .sort({ createdAt: -1 })//descending order
        .limit(10);
    });
    const followingPosts = await (await Promise.all(promises)).flat();
    //The Promise.all() method takes an iterable of promises as an input, and returns a single Promise that resolves to an array of the results of the input promises. 
    //This returned promise will fulfill when all of the input's promises have fulfilled, or if the input iterable contains no promises. 
    //It rejects immediately upon any of the input promises rejecting or non-promises throwing an error, and will reject with this first rejection message / error.

    const userPosts = await Post.find({ user: req.user.id })
      .populate("user", "first_name last_name picture username cover")
      .populate("comments.commentBy", "first_name last_name picture username")
      .sort({ createdAt: -1 })
      .limit(10);
    followingPosts.push(...[...userPosts]);
    // followingPosts.sort((a, b) => {
    //   return b.createdAt - a.createdAt;
    // });
    res.json(followingPosts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


//from functions post in frontend
exports.deletePost = async (req, res) => {
  try {
    await Post.findByIdAndRemove(req.params.id);
    res.json({ status: "ok" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};