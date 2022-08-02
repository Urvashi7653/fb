const fs = require("fs");

//default export (Otherwise it is exports.function_name)
//checks file size and type
//all middleware functions have next
module.exports = async (req, res, next) => {
  try {
    if (!req.files || Object.values(req.files).flat().length === 0) {
      return res.status(400).json({ message: "No files selected!" });
    }
    let files = Object.values(req.files).flat();

    //The forEach() method calls a function for each element in an array.
    files.forEach((file) => {
      if (
        file.mimetype !== "image/jpeg" &&
        file.mimetype !== "image/png" &&
        file.mimetype !== "image/gif" &&
        file.mimetype !== "image/webp"
      ) {
        removeTmp(file.tempFilePath);
        return res.status(400).json({ message: "Wrong file type." });
      }
      if (file.size > 1024 * 1024 * 5) {
        removeTmp(file.tempFilePath);
        return res.status(400).json({ message: "File size too large" });
      }
    });
    next();
    //next() : It will run or execute the code after all the middleware function is finished.

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


//fs.unlink(): remove a file or a symbolic link
const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};
