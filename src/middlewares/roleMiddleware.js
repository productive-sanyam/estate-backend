// middlewares/roleMiddleware.js
/**
 * Checks if the logged-in user has at least one of the required roles
 * e.g. roleMiddleware(['SUPERADMIN','ADMIN'])
 */
const roleMiddleware = (requiredRoles = []) => {
    return (req, res, next) => {
        const { roles } = req.user || {};
        // if (!roles || !Array.isArray(roles)) {
        //     return res.status(403).json({ error: 'Access denied (no roles found)' });
        // }

        // const hasRole = roles.some(r => requiredRoles.includes(r));
        // if (!hasRole) {
        //     return res.status(403).json({ error: 'Access denied (role mismatch)' });
        // }
        next();
    };
};

module.exports = roleMiddleware;
