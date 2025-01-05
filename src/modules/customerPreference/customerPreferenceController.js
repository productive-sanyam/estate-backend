// modules/customerPreference/customerPreferenceController.js
const customerPreferenceService = require('./customerPreferenceService');

const createPreference = async (req, res) => {
    try {
        // Expect { customerId, preferences: {...} }
        const newPreference = await customerPreferenceService.createPreference(req.body);
        return res.status(201).json(newPreference);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const getPreferenceByCustomerId = async (req, res) => {
    try {
        // If we rely on the route: GET /api/customer-preferences/by-customer/:customerId
        const { customerId } = req.params;
        const preference = await customerPreferenceService.getPreferenceByCustomerId(customerId);
        if (!preference) {
            return res.status(404).json({ error: 'No preference found for that customer' });
        }
        return res.status(200).json(preference);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const updatePreference = async (req, res) => {
    try {
        // If we rely on route: PUT /api/customer-preferences/:id
        const updated = await customerPreferenceService.updatePreference(req.params.id, req.body);
        return res.status(200).json(updated);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const deletePreference = async (req, res) => {
    try {
        const deleted = await customerPreferenceService.deletePreference(req.params.id);
        return res.status(200).json(deleted);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

/**
 * Example endpoint to retrieve properties matching a customer’s preference
 * GET /api/customer-preferences/:customerId/matching-properties
 *    - This is purely optional if you want to show recommended props
 */
const getPropertiesMatchingCustomerPreference = async (req, res) => {
    try {
        const { customerId } = req.params;
        const preference = await customerPreferenceService.getPreferenceByCustomerId(customerId);
        if (!preference) {
            return res.status(404).json({ error: 'No preference found for that customer' });
        }

        // Now find matching properties
        const properties = await customerPreferenceService.findPropertiesByPreference(preference.preferences);
        return res.status(200).json(properties);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createPreference,
    getPreferenceByCustomerId,
    updatePreference,
    deletePreference,
    getPropertiesMatchingCustomerPreference
};
