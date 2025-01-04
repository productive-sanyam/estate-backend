// services/roleService.js
const BaseService = require('./baseService');
const Role = require('../models/Role');

class RoleService extends BaseService {
    // Create a new role
    async createRole(roleData) {
        return this.create(roleData); // from BaseService
    }

    // Update role with concurrency check
    async updateRole(id, data) {
        const { version: reqVersion, ...roleData } = data;

        // Generic concurrency check
        const currentRole = await this.findByIdAndCheckVersion(id, reqVersion, 'Role not found');

        // Assign new data
        Object.assign(currentRole, roleData);

        // Save updated role
        return currentRole.save();
    }
}

module.exports = new RoleService(Role);
