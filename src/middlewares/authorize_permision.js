

const getPermissionsFromRoles = (userRoles) => {
    return userRoles.flatMap((roleName) => {
        // const role = rolesDefined.find((r) => r.name === roleName);
        // return role?.permissions || [];
    });
};

const authorizePermissions = (requiredPermission, options = {}) => {
    return (req, res, next) => {
        const user = req.user;

        if (options.allowSelf && req.params.userId) {
            if (user._id.toString() === req.params.userId.toString()) {
                const selfPerm = `manage:own_profile`; // Customize if needed
                const userPermissions = getPermissionsFromRoles(user.roles || []);
                if (userPermissions.includes(selfPerm)) return next();
            }
        }

        // 2. Standard permission check
        const userPermissions = getPermissionsFromRoles(user.roles || []);
        if (!userPermissions.includes(requiredPermission)) {
            return res.status(403).json({ message: 'Forbidden: Missing permission' });
        }

        next();
    };
};

module.exports = { authorizePermissions };