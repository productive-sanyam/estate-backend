const BaseService = require('../../services/baseService');
const User = require('./User');
const UserExtn = require('./UserExtn');
const bcrypt = require('bcrypt');

class UserService extends BaseService {
    constructor() {
        super(User, UserExtn);
    }

    async createUserAndExtn(userData) {
        const { email, password, userExtn } = userData;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('Email is already taken');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await this.create({
            ...userData,
            password: hashedPassword,
        });

        if (userExtn) {
            const extnData = {
                _id: newUser._id,
                ...userExtn,
            };
            await UserExtn.create(extnData);
        }


        const userWithExtn = await this.getUserById(newUser._id);
        return userWithExtn;
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

    async getUserById(id) {
        const user = await User.findById(id).populate('roles').lean();
        if (!user) {
            return null;
        }
        const extn = await UserExtn.findById(id).lean();
        return {
            ...user,
            userExtn: extn || null,
        };
    }

    async updateUser(id, data) {
        const { userExtn, password, version, ...rest } = data;

        if (password) {
            rest.password = await bcrypt.hash(password, 10);
        }

        const payload = {
            ...rest,           
            version,          
            extnData: null,
        };

        if (userExtn) {
            const { version: extnVersion, ...extnFields } = userExtn;
            payload.extnData = {
                version: extnVersion, 
                ...extnFields,
            };
        }

        const updatedUser = await this.updateRecord(id, payload);
        const userWithExtn = await this.getUserById(id);
        return userWithExtn;
    }

    async deleteUser(id) {
        const deletedUser = await this.deleteById(id);
        if (!deletedUser) {
            throw new Error('User not found');
        }

        if (this.ExtnModel) {
            await this.ExtnModel.findByIdAndDelete(id);
        }
        return deletedUser;
    }

    async deleteAllUsers() {
        const deleted = await this.deleteAll();
        return deleted;
    }
}

module.exports = new UserService();
