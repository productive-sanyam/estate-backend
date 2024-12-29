const User = require('../../models/User/User');
const UserExtn = require('../../models/User/UserExtn');
const bcrypt = require('bcrypt');
const { userSchema, userExtnSchema } = require('../../validations/userValidation');
const { createFilterFromQuery } = require('../../utils/filterUtil');
const { getPaginatedAndFilteredData } = require('../../utils/paginationUtils');

// ===================== CREATE USER =====================
const createUser = async (req, res) => {
    try {
        await userSchema.validateAsync(req.body);

        if (req.body.userExtn) {
            await userExtnSchema.validateAsync(req.body.userExtn);
        }

        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);


        const userData = {
            ...req.body,
            password: hashedPassword
        };

        const newUser = new User(userData);
        const savedUser = await newUser.save();

        if (req.body.userExtn) {
            const newUserExtnData = {
                _id: savedUser._id,
                ...req.body.userExtn
            };
            const newUserExtn = new UserExtn(newUserExtnData);
            await newUserExtn.save();
        }

        return res.status(201).json(savedUser);
    } catch (error) {
        if (error.isJoi) {
            return res.status(400).json({ error: error.details[0].message });
        }
        return res.status(500).json({ error: error.message });
    }
};

// ===================== GET USERS (GRID) =====================
const getUsers = async (req, res) => {
    try {
        const filter = createFilterFromQuery(User, req.query);
        const { page, rows } = req.query;

        const result = await getPaginatedAndFilteredData(User, filter, page, rows);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// ===================== GET USER BY ID =====================
const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId).lean();
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userExtn = await UserExtn.findById(userId).lean();
        const mergedData = {
            ...user,
            userExtn
        };

        return res.status(200).json(mergedData);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// ===================== UPDATE USER =====================
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        Object.keys(req.body).forEach((field) => {
            if (field !== '_id') {
                user[field] = req.body[field];
            }
        });

        const updatedUser = await user.save();

        if (req.body.userExtn) {
            let userExtn = await UserExtn.findById(id);
            if (!userExtn) {
                userExtn = new UserExtn({ _id: id });
            }

            Object.keys(req.body.userExtn).forEach((field) => {
                if (field !== '_id') {
                    userExtn[field] = req.body.userExtn[field];
                }
            });
            await userExtn.save();
        }

        return res.status(200).json(updatedUser);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// ===================== DELETE USER =====================
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        await UserExtn.findByIdAndDelete(id);
        return res.status(200).json(deletedUser);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
};
