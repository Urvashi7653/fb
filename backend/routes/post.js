const express = require("express");
const router = express.Router();
const { createPost,getAllPosts } = require("../controllers/post.js");
const { authUser } = require("../middlewares/auth.js");

router.post("/createPost", authUser,createPost);
router.get("/getAllPosts",getAllPosts);

module.exports = router;
