// middleware/rbac.js
const rbacMiddleware = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).redirect('/auth/login');
    }

    const userPermissions = req.user.role.permissions;

    if (!userPermissions.includes(requiredPermission)) {
      return res.status(403).send('Access denied: Insufficient permissions');
    }

    next();
  };
};

const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).redirect('/auth/login');
    }

    if (!allowedRoles.includes(req.user.role.name)) {
      return res.status(403).send('Access denied: Insufficient role');
    }

    next();
  };
};

module.exports = { rbacMiddleware, roleMiddleware };