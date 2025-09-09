const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const userRoles = req.user_decode?.roles;
        if (!userRoles) return res.status(403).json({ message: 'Forbidden' });
        const hasRole = userRoles.some((role) => allowedRoles.includes(role.name));
        if (!hasRole) return res.status(403).json({ message: 'Forbidden' });

        next();
    };
};

module.exports = { authorizeRoles };