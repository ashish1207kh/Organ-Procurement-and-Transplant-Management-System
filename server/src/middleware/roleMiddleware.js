const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access forbidden for role: ${req.user.role}. Allowed roles: ${allowedRoles.join(', ')}.`
      });
    }

    next();
  };
};

module.exports = { authorizeRoles };
