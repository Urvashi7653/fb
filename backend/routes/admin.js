const express = require("express")
const router = express.Router();
const {
    getAdminPosts, validateAdmin,approvePosts,getStats
} = require("../controllers/admin.js");

router.get("/getAdminPosts", getAdminPosts);
router.post("/validateAdmin", validateAdmin);
router.put("/approvePosts",approvePosts);
router.get("/getStats",getStats)

module.exports = router;