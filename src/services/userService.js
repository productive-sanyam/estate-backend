// services/userService.js
const BaseService = require('./baseService');
const User = require('../models/User');
const UserExtn = require('../models/UserExtn');
const bcrypt = require('bcrypt');

class UserService extends BaseService {
    /**
     * Admin-only method to create user + optional userExtn
     * userData should include createdBy from the controller side.
     */
    async createUserAndExtn(userData) {
        const { email, password, userExtn } = userData;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('Email is already taken');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create main user
        const newUser = await this.create({
            ...userData,
            password: hashedPassword
        });

        // If userExtn data is provided, create it
        if (userExtn) {
            const extnData = {
                _id: newUser._id,
                ...userExtn
            };
            await UserExtn.create(extnData);
        }

        return newUser;
    }

    /**
     * Basic login (only existing users)
     */
    async login(email, password) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }
        return user;
    }

    /**
     * For listing (with optional pagination & filter).
     */
    async listUsers(queryParams) {
        const { createFilterFromQuery } = require('../utils/filterUtil');
        const { getPaginatedAndFilteredData } = require('../utils/paginationUtils');

        const filter = createFilterFromQuery(User, queryParams);
        const page = queryParams.page;
        const rows = queryParams.rows;

        // Get paginated data
        const result = await getPaginatedAndFilteredData(User, filter, page, rows);

        return result; // { total, page, rows: user[] }
    }

    /**
     * Always returns user + userExtn (no withExtn param)
     * Also populate roles if we want ( e.g. .populate('roles') ).
     */
    async getUserById(id) {
        // .lean() => plain object
        // .populate('roles') => fetch role documents
        const user = await User.findById(id).populate('roles').lean();
        if (!user) {
            return null;
        }
        const extn = await UserExtn.findById(id).lean();
        return {
            ...user,
            userExtn: extn || null
        };
    }

    /**
     * Update user + optionally update userExtn with concurrency check
     */
    async updateUser(id, data) {
        const { userExtn, version: reqUserVersion, ...userData } = data;
        delete userData.createdAt;
        delete userData.updatedAt;
        delete userData.version;

        // If password given, hash it
        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }

        // Use the generic concurrency check from BaseService
        const currentUser = await this.findByIdAndCheckVersion(id, reqUserVersion, 'User not found');

        // Assign new data
        Object.assign(currentUser, userData);

        // Save user
        const updatedUser = await currentUser.save();

        // For userExtn, we still do a manual concurrency check or logic
        if (userExtn) {
            const { version: reqExtnVersion, ...extnData } = userExtn;
            delete extnData.createdAt;
            delete extnData.updatedAt;
            delete extnData.version;

            let currentExtn = await UserExtn.findById(id);
            if (!currentExtn) {
                // create new extn if none
                currentExtn = new UserExtn({ _id: id });
            } else {
                // manual concurrency check for extn
                if (reqExtnVersion === undefined || reqExtnVersion !== currentExtn.version) {
                    throw new Error('You are trying to update a record that has changed (extn)');
                }
            }
            Object.assign(currentExtn, extnData);
            await currentExtn.save();
        }

        return updatedUser;
    }

    /**
     * Delete user + userExtn
     */
    async deleteUser(id) {
        const deletedUser = await this.deleteById(id);
        if (!deletedUser) {
            throw new Error('User not found');
        }
        await UserExtn.findByIdAndDelete(id);
        return deletedUser;
    }
}

module.exports = new UserService(User);
