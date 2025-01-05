// modules/customerPreference/customerPreferenceService.js
const BaseService = require('../../services/baseService');
const CustomerPreference = require('./CustomerPreference');
const Customer = require('../customer/Customer');

class CustomerPreferenceService extends BaseService {
    constructor() {
        super(CustomerPreference);
    }

    async createPreference(data) {
        // Ensure the related customer exists (optional check)
        const customer = await Customer.findById(data.customerId);
        if (!customer) {
            throw new Error('Customer not found');
        }

        // You might check if the customer already has a preference doc, etc.
        // Or allow multiple preference docs (use-case dependent).
        return this.MainModel.create(data);
    }

    async getPreferenceByCustomerId(customerId) {
        return this.MainModel.findOne({ customerId });
    }

    async updatePreference(id, data) {
        // Basic update:
        return this.updateById(id, data);
    }

    async deletePreference(id) {
        // Basic delete:
        return this.deleteById(id);
    }

    /**
     * Optional helper method:
     * E.g. return properties matching preference constraints
     * (You can implement advanced matching logic here.)
     */
    async findPropertiesByPreference(preferenceData) {
        // Example: match price range, bedrooms, bathrooms, location, etc.
        // You’d likely integrate location checks or advanced $geoWithin if needed.
        const filter = {};

        if (preferenceData.minPrice) {
            filter.price = { ...filter.price, $gte: preferenceData.minPrice };
        }
        if (preferenceData.maxPrice) {
            filter.price = { ...filter.price, $lte: preferenceData.maxPrice };
        }
        if (preferenceData.bedrooms) {
            filter.bedrooms = { $gte: preferenceData.bedrooms };
        }
        if (preferenceData.bathrooms) {
            filter.bathrooms = { $gte: preferenceData.bathrooms };
        }
        if (preferenceData.location) {
            // naive example: partial match on location field
            filter['location.city'] = { $regex: new RegExp(preferenceData.location, 'i') };
        }


        const Property = require('../property/Property');
        return Property.find(filter);
    }
}

module.exports = new CustomerPreferenceService();
