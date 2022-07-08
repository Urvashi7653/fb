const User = require("../models/User");
const { validateEmail,validateLength } = require("../helpers/validation");
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

    if (!validateEmail(email)) {
      return res.status(400).json({
        message: "Invalid email address",
      });
    }

    if (!validateLength(first_name,3,30)) {
      return res.status(400).json({
        message: "First name should be between 3 and 30 characters",
      });
    }

    if (!validateLength(last_name,3,30)) {
      return res.status(400).json({
        message: "Last name should be between 3 and 30 characters",
      });
    }

    if (!validateLength(password,6,30)) {
      return res.status(400).json({
        message: "Password should be between 6 and 30 characters",
      });
    }
   
    const bcryptedpassword = await bcrypt.hash(password,10)

    const check = await User.findOne({ email: email });
    if (check) {
      return res.status(400).json({
        message: "Email already in use",
      });
    }

    const user = await new User(req.body);
    user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  //console.log(req.body);
};
