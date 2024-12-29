const User = require('../../models/User/User');
const UserExtn = require('../../models/User/UserExtn');
const bcrypt = require('bcrypt');
const { userSchema } = require('../../validations/userValidation');
const { getPaginatedAndFilteredData } = require('../../utils/paginationUtils');

const createUser = async (req, res) => {
    try {
        await userSchema.validateAsync(req.body);
        const { name, email, password, phoneNo, address } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phoneNo,
            address,
        });

        const savedUser = await newUser.save();
        const newUserExtn = new UserExtn({
            _id: savedUser._id,
            profilePic: '',
            viewOwnEntityOnly: false,
            lastActive: Math.floor(Date.now()),
            designation: '',
            department: '',
        });
        await newUserExtn.save();
        return res.status(201).json(savedUser);
    } catch (error) {
        if (error.isJoi) {
            return res.status(400).json({ error: error.details[0].message });
        }
        return res.status(500).json({ error: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const { page, rows, name, email } = req.query;

        const filter = {};
        if (name) filter.name = new RegExp(name, 'i');
        if (email) filter.email = new RegExp(email, 'i');

        const result = await getPaginatedAndFilteredData(User, filter, page, rows);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

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
            userExtn,
        };
        return res.status(200).json(mergedData);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const { name, email, phoneNo, address } = req.body;
        if (name !== undefined) user.name = name;
        if (email !== undefined) user.email = email;
        if (phoneNo !== undefined) user.phoneNo = phoneNo;
        if (address !== undefined) user.address = address;

        const updatedUser = await user.save();
        return res.status(200).json(updatedUser);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

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
