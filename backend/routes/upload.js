const express = require("express");
const { uploadImages } = require("../controllers/upload.js");
const router = express.Router();
const imageUpload = require("../middlewares/imageUpload.js")
//const {authUser} = require("../middlewares/auth.js")

//router.post("/uploadImages",authUser,imageUpload, uploadImages);
router.post("/uploadImages",imageUpload, uploadImages);

module.exports = router;
