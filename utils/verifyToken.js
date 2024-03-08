const jwt = require('jsonwebtoken');

const verifyToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return 'TokenExpiredError';
    }
    console.error(error.message);
    return false;
  }
};

module.exports = verifyToken;
