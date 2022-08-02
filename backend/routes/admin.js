const express = require("express")
const router = express.Router();
const {
    getAdminPosts, validateAdmin
} = require("../controllers/admin.js");

router.get("/getAdminPosts", getAdminPosts);
router.post("/validateAdmin", validateAdmin);

module.exports = router;