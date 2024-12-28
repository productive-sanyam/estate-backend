const Property = require('../../models/Property/Property.js');
const PropertyExtn = require('../../models/Property/PropertyExtn');

// Create a new property
const createProperty = async (req, res) => {
    try {
        const {
            title,
            description,
            price,
            size,
            status,
            tags,
            location,
            images,
            assignedTo,
            notes,
            documents,
            customFields,
        } = req.body;

        // Create core property
        const property = new Property({
            title,
            description,
            price,
            size,
            status,
            tags,
            location,
            images,
            assignedTo,
            createdBy: req.user._id, // Assuming `req.user` contains authenticated user info
        });

        const savedProperty = await property.save();

        // Create property extension
        const propertyExtn = new PropertyExtn({
            _id: savedProperty._id,
            notes,
            documents,
            customFields,
        });

        await propertyExtn.save();

        res.status(201).json({ message: 'Property created successfully', property: savedProperty });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create property', error: error.message });
    }
};

// Get all properties with filters
const getProperties = async (req, res) => {
    try {
        const { status, tags, city, assignedTo } = req.query;

        const filters = {};
        if (status) filters.status = status;
        if (tags) filters.tags = { $in: tags.split(',') };
        if (city) filters['location.city'] = city;
        if (assignedTo) filters.assignedTo = assignedTo;

        const properties = await Property.find(filters)
            .populate('assignedTo', 'name email') // Populate assigned user
            .populate('createdBy', 'name email'); // Populate creator

        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch properties', error: error.message });
    }
};

// Get a single property
const getPropertyById = async (req, res) => {
    try {
        const { id } = req.params;

        const property = await Property.findById(id)
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email');

        const propertyExtn = await PropertyExtn.findById(id);

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        res.status(200).json({ ...property.toObject(), ...propertyExtn.toObject() });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch property', error: error.message });
    }
};

// Update a property
const updateProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            description,
            price,
            size,
            status,
            tags,
            location,
            images,
            assignedTo,
            notes,
            documents,
            customFields,
        } = req.body;

        const property = await Property.findById(id);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Update core property
        property.title = title || property.title;
        property.description = description || property.description;
        property.price = price || property.price;
        property.size = size || property.size;
        property.status = status || property.status;
        property.tags = tags || property.tags;
        property.location = location || property.location;
        property.images = images || property.images;
        property.assignedTo = assignedTo || property.assignedTo;

        const updatedProperty = await property.save();

        // Update property extension
        const propertyExtn = await PropertyExtn.findById(id);
        if (propertyExtn) {
            propertyExtn.notes = notes || propertyExtn.notes;
            propertyExtn.documents = documents || propertyExtn.documents;
            propertyExtn.customFields = customFields || propertyExtn.customFields;

            await propertyExtn.save();
        }

        res.status(200).json({ message: 'Property updated successfully', property: updatedProperty });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update property', error: error.message });
    }
};

// Delete a property
const deleteProperty = async (req, res) => {
    try {
        const { id } = req.params;

        const property = await Property.findByIdAndDelete(id);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        await PropertyExtn.findByIdAndDelete(id);

        res.status(200).json({ message: 'Property deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete property', error: error.message });
    }
};

module.exports = {
    createProperty,
    getProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,
};
