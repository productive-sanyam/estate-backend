const Role = require('../../models/Role/Role');

// Create Role
const createRole = async (req, res) => {
    try {
        const { name, rights, forCpanel } = req.body;

        const role = new Role({
            name,
            rights,
            forCpanel,
        });

        const savedRole = await role.save();
        res.status(201).json({ message: 'Role created successfully', role: savedRole });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create role', error: error.message });
    }
};

// Update Role
const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, rights, forCpanel } = req.body;

        const role = await Role.findById(id);
        if (!role) return res.status(404).json({ message: 'Role not found' });

        role.name = name || role.name;
        role.rights = rights || role.rights;
        role.forCpanel = forCpanel || role.forCpanel;

        const updatedRole = await role.save();
        res.status(200).json({ message: 'Role updated successfully', role: updatedRole });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update role', error: error.message });
    }
};

// Get Role Details
const getRole = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await Role.findById(id);
        if (!role) return res.status(404).json({ message: 'Role not found' });

        res.status(200).json(role);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch role', error: error.message });
    }
};

// Delete Role
const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await Role.findByIdAndDelete(id);
        if (!role) return res.status(404).json({ message: 'Role not found' });

        res.status(200).json({ message: 'Role deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete role', error: error.message });
    }
};

module.exports = {
    createRole,
    updateRole,
    getRole,
    deleteRole,
};
