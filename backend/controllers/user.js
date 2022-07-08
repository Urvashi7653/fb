const User = require("../models/User");
const {validateEmail} = require("../helpers/validation")
exports.register = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      username,
      email,
      password,
      gender,
      bYear,
      bMonth,
      bDate,
    } = req.body;

if(!validateEmail(email)){
  return res.status(400).json({
    message:"Invalid email address"
  })
}

const check = await User.findOne({email:email})
if(check){
  return res.status(400).json({
    message:"Email already in use"
  })
}

    const user = await new User(req.body);
    user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  //console.log(req.body);
};
