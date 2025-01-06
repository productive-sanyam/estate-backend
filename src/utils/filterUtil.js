/**
 * ======================================================
 *        POSSIBLE QUERY OPERATORS - DOCUMENTATION
 * ======================================================
 * 
 * Here are examples of how query parameters might look:
 * 
 * 1)  Equal / Not Equal
 *     ?status=eq(active)
 *     ?status=ne(inactive)
 * 
 * 2)  Comparison Operators
 *     ?age=gt(18)
 *     ?age=gte(21)
 *     ?age=lt(65)
 *     ?age=lte(70)
 * 
 * 3)  Inclusion / Exclusion
 *     ?roles=in[ADMIN,USER]
 *     ?roles=nin[GUEST]
 * 
 * 4)  "All" Array Matching
 *     ?tags=all[node,express]
 * 
 * 5)  Exact Array Matching
 *     ?someArray=exactArray[a,b,c]   // must exactly match [ 'a', 'b', 'c' ]
 * 
 * 6)  Field Exists / Not Exists
 *     ?profilePic=exists
 *     ?profilePic=notExists
 * 
 * 7)  Regex Matching
 *     ?name=regex(john)       // partial, case-insensitive match: { $regex: /john/i }
 * 
 * 8)  Sorting
 *     ?sortBy=name&sortAsc=true
 *     or
 *     ?sortBy=createdAt&sortAsc=false
 * 
 * 9)  Basic direct usage (fallback)
 *     ?count=10   // If none of the above patterns apply, we do an exact match
 * 
 * Combine them with pagination meta:
 *     ?page=1&rows=5&sortBy=name&sortAsc=true&status=eq(active)
 *
 * Note: Implementation below is an example. Adjust or extend as needed.
 */

function setNestedProperty(obj, key, value) {
    const parts = key.split('.');
    let current = obj;

    for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (!current[part]) current[part] = {};
        current = current[part];
    }

    current[parts[parts.length - 1]] = value;
}

/**
 * Parse a queryValue like "eq(active)", "in[ADMIN,USER]", "exists", "regex(john)", etc.
 * Return the corresponding MongoDB filter object: { $eq: 'active' }, { $exists: true }, etc.
 */
function parseOperatorAndValue(rawValue) {
    // 1) Check for special keywords/operations
    // Patterns: op(...) or op[...] or just raw
    // We'll handle them in a certain priority order

    // "exists"
    if (rawValue === 'exists') {
        return { $exists: true };
    }
    // "notExists"
    if (rawValue === 'notExists') {
        return { $exists: false };
    }

    // eq(...)
    let match = rawValue.match(/^eq\((.*)\)$/);
    if (match) {
        return { $eq: convertValue(match[1]) };
    }

    // ne(...)
    match = rawValue.match(/^ne\((.*)\)$/);
    if (match) {
        return { $ne: convertValue(match[1]) };
    }

    // gt(...), gte(...), lt(...), lte(...)
    match = rawValue.match(/^gt\((.*)\)$/);
    if (match) {
        return { $gt: convertValue(match[1]) };
    }
    match = rawValue.match(/^gte\((.*)\)$/);
    if (match) {
        return { $gte: convertValue(match[1]) };
    }
    match = rawValue.match(/^lt\((.*)\)$/);
    if (match) {
        return { $lt: convertValue(match[1]) };
    }
    match = rawValue.match(/^lte\((.*)\)$/);
    if (match) {
        return { $lte: convertValue(match[1]) };
    }

    // in[...], nin[...], all[...]
    match = rawValue.match(/^in\[(.*)\]$/);
    if (match) {
        const values = match[1].split(',').map(v => convertValue(v.trim()));
        return { $in: values };
    }
    match = rawValue.match(/^nin\[(.*)\]$/);
    if (match) {
        const values = match[1].split(',').map(v => convertValue(v.trim()));
        return { $nin: values };
    }
    match = rawValue.match(/^all\[(.*)\]$/);
    if (match) {
        const values = match[1].split(',').map(v => convertValue(v.trim()));
        return { $all: values };
    }

    // exactArray[...]
    match = rawValue.match(/^exactArray\[(.*)\]$/);
    if (match) {
        // for exact array matching, we can use $eq: [...]
        const values = match[1].split(',').map(v => convertValue(v.trim()));
        return { $eq: values };
    }

    // regex(...)
    match = rawValue.match(/^regex\((.*)\)$/);
    if (match) {
        // partial, case-insensitive
        return { $regex: new RegExp(match[1], 'i') };
    }

    // Fallback => direct match or string partial if you want:
    //   But typically you'd do { $eq: rawValue } for direct exact match.
    //   Or you can choose a default to be a case-insensitive regex if field is string.
    return { $eq: convertValue(rawValue) };
}

/**
 * Attempt to convert the string to a boolean / number if it matches
 * otherwise return as string.
 */
function convertValue(value) {
    if (!isNaN(value) && value.trim() !== '') {
        return Number(value);
    }
    // 'true' / 'false' => boolean
    if (value === 'true') return true;
    if (value === 'false') return false;

    // otherwise, leave as string
    return value;
}

/**
 * createFilterFromQuery():
 *  - Parse all query keys that are not pagination/sorting keys.
 *  - For each recognized field in the schema, apply the appropriate operator.
 *  - Return a MongoDB filter object to be used in Model.find(filter).
 */
function createFilterFromQuery(Model, query) {
    const filter = {};
    const schemaPaths = Model.schema.paths; // includes nested paths as "address.country"

    // We'll skip these from filtering logic
    const skipKeys = ['page', 'rows', 'sortBy', 'sortAsc', 'withExtn'];

    for (const queryKey of Object.keys(query)) {
        if (skipKeys.includes(queryKey)) {
            continue;
        }

        // For example: "address.country" or "value.subvalue"
        // We want to see if the schema has this exact path
        const schemaPathKey = Object.keys(schemaPaths).find(pathKey => pathKey === queryKey);

        if (schemaPathKey) {
            const rawValue = query[queryKey];
            const fieldType = schemaPaths[schemaPathKey].instance;

            // parse the operator pattern from rawValue
            const mongoFilterObject = parseOperatorAndValue(rawValue);

            // Example result might be { $eq: 'active' } or { $in: [...] }, etc.
            // Now assign it to filter[schemaPathKey]
            // If the field is type String and not using an operator, you might do partial match:
            // But we are now covering that with 'regex(...)' for partial matching.
            setNestedProperty(filter, schemaPathKey, mongoFilterObject);
        }
        // else you might want to ignore or handle advanced use-cases
    }

    return filter;
}

module.exports = { createFilterFromQuery };
