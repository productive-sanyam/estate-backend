// modules/customer/customerService.js
const BaseService = require('../../services/baseService');
const Customer = require('./Customer');

class CustomerService extends BaseService {
    constructor() {
        super(Customer);
    }

    async createCustomer(data) {
        const existing = await Customer.findOne({ email: data.email });
        if (existing) {
            throw new Error('A customer with this email already exists.');
        }
        return await this.create(data);
    }

    async getCustomerById(id) {
        return Customer.findById(id);
    }

    async updateCustomer(id, data) {
        return this.updateById(id, data);
    }

    async deleteCustomer(id) {
        return this.deleteById(id);
    }
}

module.exports = new CustomerService();
