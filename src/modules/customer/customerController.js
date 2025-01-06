// modules/customer/customerController.js
const customerService = require('./customerService');

const createCustomer = async (req, res) => {
    try {
        const newCustomer = await customerService.createCustomer(req.body);
        return res.status(201).json(newCustomer);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const getCustomers = async (req, res) => {
    try {
        const customers = await customerService.list(req.query);
        return res.status(200).json(customers);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const getCustomerById = async (req, res) => {
    try {
        const customer = await customerService.getCustomerById(req.params.id);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        return res.status(200).json(customer);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const updateCustomer = async (req, res) => {
    try {
        const updated = await customerService.updateCustomer(req.params.id, req.body);
        return res.status(200).json(updated);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const deleteCustomer = async (req, res) => {
    try {
        const deleted = await customerService.deleteCustomer(req.params.id);
        return res.status(200).json(deleted);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createCustomer,
    getCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer
};
