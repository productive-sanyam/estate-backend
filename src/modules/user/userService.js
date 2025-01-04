const BaseService = require('./../../services/baseService');
const User = require('./User');
const UserExtn = require('./UserExtn');
const bcrypt = require('bcrypt');

class UserService extends BaseService {
    async createUserAndExtn(userData) {
        const { email, password, userExtn } = userData;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('Email is already taken');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await this.create({
            ...userData,
            password: hashedPassword
        });

        if (userExtn) {
            const extnData = {
                _id: newUser._id,
                ...userExtn
            };
            await UserExtn.create(extnData);
        }

        return newUser;
    }


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

    async listUsers(queryParams) {
        const { createFilterFromQuery } = require('../../utils/filterUtil');
        const { getPaginatedAndFilteredData } = require('../../utils/paginationUtils');

        const filter = createFilterFromQuery(User, queryParams);
        const page = queryParams.page;
        const rows = queryParams.rows;

        const result = await getPaginatedAndFilteredData(User, filter, page, rows);

        return result;
    }

    async getUserById(id) {
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

    async updateUser(id, data) {
        const { userExtn, version: reqUserVersion, ...userData } = data;
        delete userData.createdAt;
        delete userData.updatedAt;
        delete userData.version;

        // If password given, hash it
        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }

        const currentUser = await this.findByIdAndCheckVersion(id, reqUserVersion, 'User not found');

        Object.assign(currentUser, userData);

        const updatedUser = await currentUser.save();

        if (userExtn) {
            const { version: reqExtnVersion, ...extnData } = userExtn;
            delete extnData.createdAt;
            delete extnData.updatedAt;
            delete extnData.version;

            let currentExtn = await UserExtn.findById(id);
            if (!currentExtn) {
                currentExtn = new UserExtn({ _id: id });
            } else {
                if (reqExtnVersion === undefined || reqExtnVersion !== currentExtn.version) {
                    throw new Error('You are trying to update a record that has changed (extn)');
                }
            }
            Object.assign(currentExtn, extnData);
            await currentExtn.save();
        }

        return updatedUser;
    }


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
