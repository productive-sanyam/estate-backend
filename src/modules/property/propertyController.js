const propertyService = require('./propertyService');

const createProperty = async (req, res) => {
    try {
        const payload = {
            ...req.body,
            createdBy: req.user.userId,
            propertyExtn: req.body.propertyExtn
        };
        const property = await propertyService.createPropertyAndExtn(payload, req.user.userId);
        return res.status(201).json(property);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const getProperties = async (req, res) => {
    try {
        const result = await propertyService.list(req.query);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const getPropertyById = async (req, res) => {
    try {
        const property = await propertyService.getPropertyById(req.params.id);
        if (!property) {
            return res.status(404).json({ error: 'Property not found.' });
        }
        return res.status(200).json(property);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const updateProperty = async (req, res) => {
    try {
        const payload = {
            ...req.body,
            updatedBy: req.user.userId
        };
        const updatedProperty = await propertyService.updateProperty(req.params.id, payload, req.user.userId);
        return res.status(200).json(updatedProperty);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const deleteProperty = async (req, res) => {
    try {
        const deletedProperty = await propertyService.deleteProperty(req.params.id);
        return res.status(200).json(deletedProperty);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createProperty,
    getProperties,
    getPropertyById,
    updateProperty,
    deleteProperty
};