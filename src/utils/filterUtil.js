/**
 * Automatically create a Mongoose filter object from query parameters
 * by checking if each query param corresponds to a field in the Model's schema.
 * For string fields, it does a case-insensitive partial match using RegExp.
 */

function createFilterFromQuery(Model, query) {
    const filter = {};
    const schemaFields = Object.keys(Model.schema.paths);

    for (const key of Object.keys(query)) {
        if (schemaFields.includes(key)) {
            const fieldType = Model.schema.paths[key].instance;
            const value = query[key];

            if (fieldType === 'String') {
                filter[key] = new RegExp(value, 'i');
            } else {
                filter[key] = value;
            }
        }
    }

    return filter;
}

module.exports = { createFilterFromQuery };
