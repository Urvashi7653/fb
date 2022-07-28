const express = require("express");
const { uploadImages,listImages } = require("../controllers/upload.js");  // not a default import
const router = express.Router();
const imageUpload = require("../middlewares/imageUpload.js");

router.post("/uploadImages",imageUpload, uploadImages);
router.get("/listImages",listImages);

module.exports = router; 
