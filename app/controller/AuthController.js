// controllers/authController.js
const User = require('../model/UserModel');
const Role = require('../model/UserModel');
const jwt = require('jsonwebtoken');


const getPermissionsForRole = (roleName) => {
  const roles = {
    superadmin: ['manage_users', 'manage_roles', 'assign_admins', 'assign_managers', 'assign_employees'],
    admin: ['manage_managers', 'manage_employees', 'create_tasks'],
    manager: ['assign_tasks', 'view_tasks', 'view_progress'],
    employee: ['view_assigned_tasks', 'update_task_status'],
  };
  return roles[roleName.toLowerCase()] || [];
}

// Render register page
const getRegister = (req, res) => {
  res.render('register');
};

// Register user
const register = async (req, res) => {
  console.log('Request body:', req.body);
  const { name, email, password, roleName } = req.body;

  // Validate input
  if (!name || !email || !password || !roleName) {
    console.log('Missing fields:', { name, email, password, roleName });
    req.flash('error', 'All fields are required: name, email, password, roleName');
    return res.status(400).render('register', { error: req.flash('error'), success: null });
  }

  // Validate roleName
  const validRoles = ['superadmin', 'admin', 'manager', 'employee'];
  if (!validRoles.includes(roleName.toLowerCase())) {
    console.log('Invalid role:', roleName);
    req.flash('error', 'Invalid role selected');
    return res.status(400).render('register', { error: req.flash('error'), success: null });
  }

  try {
    // Find or create role
    let role = await Role.findOne({ name: roleName.toLowerCase() });
    console.log('Role query result:', role);
    if (!role) {
      role = new Role({ name: roleName.toLowerCase(), permissions: getPermissionsForRole(roleName.toLowerCase()) });
      await role.save();
      console.log('Role created:', role);
    }
    if (!role._id) {
      throw new Error('Role creation failed: No _id generated');
    }
    console.log('Role ID:', role._id);

    // Create user object
    const userData = { name, email, password, role: role._id };
    console.log('User data to save:', userData);

    const user = new User(userData);
    console.log('User instance before save:', user);

    await user.save();
    console.log('User saved:', user);

    req.flash('success', 'Registration successful! Please log in.');
    res.redirect('/auth/login');
  } catch (err) {
    console.error('Registration error:', err);
    req.flash('error', `Registration failed: ${err.message}`);
    res.status(400).render('register', { error: req.flash('error'), success: null });
  }
};

// Render login page
const getLogin = (req, res) => {
  res.render('login');
};

// Login user
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).populate('role');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).send('Invalid credentials');
    }

    const accessToken = jwt.sign({ userId: user._id }, 'access_secret', { expiresIn: '15m' }); // Replace secret
    const refreshToken = jwt.sign({ userId: user._id }, 'refresh_secret', { expiresIn: '7d' }); // Replace secret

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('accessToken', accessToken, { httpOnly: true, secure: false }); // secure: true in prod
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: false });

    if (user.role.name === 'superadmin') {
      return res.redirect('/superadmin/dashboard');
    }

    res.redirect('/'); // Default redirect
  } catch (err) {
    res.status(400).send(err.message);
  }
};




module.exports = { getRegister, register, getLogin, login };