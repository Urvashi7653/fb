const Post = require("../models/Post");
const bcrypt = require("bcryptjs");

exports.validateAdmin = async (req, res) => {
    try {
      const { password } = req.body;
      const adminPassword = await bcrypt.hash("123456",10)
      const check = await bcrypt.compare(password,adminPassword );
      if (!check) {
        return res.status(400).json({ message: "Incorrect password" });
      }
      res.send({
        message : "Admin login successfull"
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  exports.getAdminPosts = async(req,res)=>{
    try {
        const posts = await Post.find()
        .populate("user","first_name last_name picture username cover")
        .populate("comments.commentBy", "first_name last_name picture username")
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });  
    }
  }