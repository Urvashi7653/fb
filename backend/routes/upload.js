const express = require("express");
const { uploadImages } = require("../controllers/upload.js");
const router = express.Router();
const imageUpload = require("../middlewares/imageUpload.js")

router.post("/uploadImages",imageUpload, uploadImages);

module.exports = router;
