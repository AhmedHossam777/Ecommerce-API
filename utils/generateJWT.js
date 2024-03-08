require('dotenv').config();
const jwt = require('jsonwebtoken');

const signAccessToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = { userId };
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const option = { expiresIn: process.env.ACCESS_TOKEN_LIFE };

    jwt.sign(payload, secret, option, (err, token) => {
      if (err) {
        reject(new Error(err.message));
      } else {
        resolve(token);
      }
    });
  });
};

const generateAccessToken = async(user,req,res)=>{
  const token = await signAccessToken(user._id);

  return token;
}

module.exports = {generateAccessToken}