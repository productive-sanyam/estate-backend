const BaseService = require('./../../services/baseService');
const Property = require('./Property');
const PropertyExtn = require('./PropertyExtn');

class PropertyService extends BaseService {
    constructor() {
        super(Property, PropertyExtn);
    }

    async createPropertyAndExtn(propertyData) {
        const {propertyExtn } = propertyData;

        const existingProperty = await Property.findOne({ title: propertyData.title, address: propertyData.address });
        if (existingProperty) {
            throw new Error('Property with the same title and address already exists.');
        }

        const newProperty = await this.create(propertyData);

        if (propertyExtn) {
            const extnData = {
                _id: newProperty._id,
                ...propertyExtn
            };
            await PropertyExtn.create(extnData);
        }

        const propertyWithExtn = await this.getPropertyById(newProperty._id);
        return propertyWithExtn;
    }

    async getPropertyById(id) {
        const property = await Property.findById(id).lean();
        if (!property) {
            return null;
        }
        const extn = await PropertyExtn.findById(id).lean();
        return {
            ...property,
            propertyExtn: extn || null,
        };
    }

    async updateProperty(id, data, updatedBy) {
        const { propertyExtn, version, ...rest } = data;

        const payload = {
            ...rest,
            updatedBy: updatedBy,
            version: version
        };

        if (propertyExtn) {
            payload.extnData = {
                version: propertyExtn.version,
                ...propertyExtn
            };
        }

        const updatedProperty = await this.updateRecord(id, payload);
        const propertyWithExtn = await this.getPropertyById(id);
        return propertyWithExtn;
    }

    async deleteProperty(id) {
        const property = await Property.findByIdAndDelete(id);
        if (!property) {
            throw new Error('Property not found.');
        }

        if (this.ExtnModel) {
            await this.ExtnModel.findByIdAndDelete(id);
        }
        return property;
    }

    /**
     * Get properties that are either assigned to a particular customer or visible to all
     */
    async getPropertiesForCustomer(customerId, queryParams) {
        // Build up the filter
        // ( visibleToAll == true ) OR ( assignedCustomers contains customerId )
        const filter = {
            $or: [
                { visibleToAll: true },
                { assignedCustomers: customerId }
            ]
        };

        // Reuse your pagination or filtering logic if you like:
        const { page, rows, sortBy, sortAsc } = queryParams;
        return this.MainModel.find(filter)
            .sort({ [sortBy || 'createdAt']: sortAsc === 'true' ? 1 : -1 })
            .skip(((page || 1) - 1) * (rows || 5))
            .limit(rows == -1 ? 0 : (rows || 5))
            .exec();
    }
    
}

module.exports = new PropertyService();