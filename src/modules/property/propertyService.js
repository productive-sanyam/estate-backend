const BaseService = require('./baseService');
const Property = require('./Property');
const PropertyExtn = require('./PropertyExtn');

class PropertyService extends BaseService {
    constructor() {
        super(Property, PropertyExtn);
    }

    async createPropertyAndExtn(propertyData, createdBy) {
        const existingProperty = await Property.findOne({ title: propertyData.title, address: propertyData.address });
        if (existingProperty) {
            throw new Error('Property with the same title and address already exists.');
        }

        const newProperty = await this.create({
            ...propertyData,
            createdBy: createdBy,
            updatedBy: createdBy
        });

        if (propertyData.propertyExtn) {
            const extnData = {
                _id: newProperty._id,
                ...propertyData.propertyExtn
            };
            await PropertyExtn.create(extnData);
        }

        const propertyWithExtn = await this.getPropertyById(newProperty._id);
        return propertyWithExtn;
    }

    async getPropertyById(id) {
        const property = await Property.findById(id).populate('createdBy').populate('updatedBy').populate('assignedTo').lean();
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
}

module.exports = new PropertyService();