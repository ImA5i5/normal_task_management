// controllers/superadminController.js
const getDashboard = (req, res) => {
  res.render('superadmin', { user: req.user });
};

module.exports = { getDashboard };