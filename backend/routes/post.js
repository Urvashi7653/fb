const express = require("express");
const router = express.Router();
const { createPost,getAllPosts,deletePost } = require("../controllers/post.js");
const { authUser } = require("../middlewares/auth.js");

router.post("/createPost", authUser,createPost);
router.get("/getAllPosts",authUser,getAllPosts);
router.delete("/deletePost/:id", authUser, deletePost);

module.exports = router;
