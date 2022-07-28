//Middleware functions are functions that have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle.
// These functions are used to modify req and res objects for tasks like parsing request bodies, adding response headers, etc.



require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.authUser = async (req, res, next) => {
  try {
    let tmp = req.header("Authorization");
    const token = tmp.slice(7, tmp.length);
    // Use bearer before writing token
    //Bearer authentication (also called token authentication) is an HTTP authentication scheme that involves security tokens called bearer tokens. The name “Bearer authentication” can be understood as “give access to the bearer of this token.” 
    //The bearer token is a cryptic string, usually generated by the server in response to a login request. The client must send this token in the Authorization header when making requests to protected resources.

    if (!token) {
      return res.status(400).json({ message: "Invalid authentication........" })
    }
    jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, user) => {
      if (err) { return res.status(400).json({ message: "Invalid authentication" }) }
      req.user = user;  // modified request
      next();
      //next() : It will run or execute the code after all the middleware function is finished.
    })
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
