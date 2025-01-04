const userService = require('./userService');

const createUser = async (req, res) => {
    try {
        const payload = {
            ...req.body,
            createdBy: req.user.userId,
            updatedBy: req.user.userId
        };
        const user = await userService.createUserAndExtn(payload);
        return res.status(200).json(user);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const result = await userService.list(req.query);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};


const updateUser = async (req, res) => {
    try {
        const payload = {
            ...req.body,
            updatedBy: req.user.userId
        };
        const updatedUser = await userService.updateUser(req.params.id, payload);
        return res.status(200).json(updatedUser);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const deleted = await userService.deleteUser(req.params.id);
        return res.status(200).json(deleted);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const deleteAllUsers = async (req, res) => {
    try {
        const deleted = await userService.deleteAllUsers();
        return res.status(200).json(deleted);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    deleteAllUsers
};
