// controllers/roleController.js
const roleService = require('./roleService');
const Role = require('./Role');

const createRole = async (req, res) => {
    try {
        const role = await roleService.createRole({
            ...req.body,
            createdBy: req.user.userId,
            updatedBy: req.user.userId
        });
        return res.status(201).json(role);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const getRoles = async (req, res) => {
    try {
        const roles = await roleService.list();
        return res.status(200).json(roles);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const getRoleById = async (req, res) => {
    try {
        const role = await roleService.getById(req.params.id);
        if (!role) {
            return res.status(404).json({ error: 'Role not found' });
        }
        return res.status(200).json(role);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const updateRole = async (req, res) => {
    try {
        const data = {
            ...req.body,
            updatedBy: req.user.userId
        };
        const updatedRole = await roleService.updateRole(req.params.id, data);
        return res.status(200).json(updatedRole);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const deleteRole = async (req, res) => {
    try {
        const deleted = await roleService.deleteById(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Role not found' });
        }
        return res.status(200).json(deleted);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createRole,
    getRoles,
    getRoleById,
    updateRole,
    deleteRole
};
