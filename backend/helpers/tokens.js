const jwt = require("jsonwebtoken");

// This will be called as generateToken({ id: user._id.toString() }, "7d");
exports.generateToken=(payload,expired)=>{

// jwt.sign(payload, secretOrPrivateKey, [options, callback])
// (Asynchronous) If a callback is supplied, the callback is called with the err or the JWT.
// (Synchronous) Returns the JsonWebToken as string
// payload could be an object literal, buffer or string representing valid JSON.
return jwt.sign(payload,`${process.env.JWT_TOKEN_SECRET}`,{
    expiresIn:expired
})
}