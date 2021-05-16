require('dotenv').config();

const { SECRETE_KEY } = process.env;
const jwt = require('jsonwebtoken');

function createToken(user) {
  const token = jwt.sign(
    user,
    SECRETE_KEY,
    {
      expiresIn: '24h',
    },
  );
  return token;
}
async function verifyToken(token) {
  try {
    const decode = await jwt.verify(token, SECRETE_KEY);
    return decode;
  } catch (ex) {
    return null;
  }
}
const getUserToken = async ({ req }) => {
  const token = await req.headers.authorization || '';
  const user = await verifyToken(token);
  return user;
};
module.exports = { createToken, verifyToken, getUserToken };
