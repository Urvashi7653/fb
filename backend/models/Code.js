const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const codeSchema = new mongoose.Schema({
  code: {
    type: String,       //number will not consider 0
    required: true,
  },
  user: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
});


//default export
module.exports = mongoose.model("Code", codeSchema);