// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../model/UserModel');

const verifyToken = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res.status(401).redirect('/auth/login');
  }

  try {
    const decoded = jwt.verify(accessToken, 'access_secret'); // Replace with env secret
    req.user = await User.findById(decoded.userId).populate('role');
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return handleRefreshToken(req, res, next);
    }
    res.status(403).send('Invalid token');
  }
};

const handleRefreshToken = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).redirect('/auth/login');
  }

  try {
    const decoded = jwt.verify(refreshToken, 'refresh_secret'); // Replace with env secret
    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).send('Invalid refresh token');
    }

    const newAccessToken = jwt.sign({ userId: user._id }, 'access_secret', { expiresIn: '15m' });
    res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: false }); // Set secure: true in production

    req.user = user.populate('role');
    next();
  } catch (err) {
    res.status(403).send('Invalid refresh token');
  }
};

module.exports = { verifyToken };