const getTokenFromHeader = (req) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startWith(' bearer')) {
    return null;
  }
  const token = authHeader.split(' ')[1];

  return token;
};

module.exports = {getTokenFromHeader}