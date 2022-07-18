require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.authUser = async (req, res, next) => {
  try {
    let tmp = req.header("Authorization");
    const token = tmp.slice(7,tmp.length);
    if(!token){
        return res.status(400).json({message: "Invalid authentication..........."})
    }
    jwt.verify(token,process.env.JWT_TOKEN_SECRET,(err,user)=> {
        if(err)
        {return res.status(400).json({message: "Invalid authentication"})}
        req.user=user;
        next();
    })
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
