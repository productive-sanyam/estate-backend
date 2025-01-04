// models/AccessRight.js
/**
 * Adapted from your Java enum; store as a simple object or array.
 */
const AccessRight = {
    IS_SUPERADMIN: { group: 'Super Admin Rights', detail: 'Is a SuperAdmin', value: 1, isSpecial: true },
    IS_CORP_ADMIN: { group: 'Corporate Supervisor', detail: 'Is a Corporate Supervisor', value: 2, isSpecial: true },
    // ... fill out the rest as desired ...
};

module.exports = AccessRight;
