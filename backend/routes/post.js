const express = require("express");
const router = express.Router();
const { createPost } = require("../controllers/post.js");
const { authUser } = require("../middlewares/auth.js");

router.post("/createPost", authUser,createPost);

module.exports = router;
