const express = require("express");
const { uploadImages } = require("../controllers/upload.js");  // not a default import
const router = express.Router();

//default import
const imageUpload = require("../middlewares/imageUpload.js");

router.post("/uploadImages",imageUpload, uploadImages);

module.exports = router; 
