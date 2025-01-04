// utils/paginationUtils.js
async function getPaginatedAndFilteredData(Model, filter, page = 1, rows = 5, sortBy, sortAsc) {
    const pageNum = parseInt(page, 10) || 1;
    const rowsNum = parseInt(rows, 10) || 5;

    // If rows = -1 => return all
    const limit = rowsNum === -1 ? 0 : rowsNum;
    const skip = (pageNum - 1) * rowsNum;

    let sortOptions = {};
    if (sortBy) {
        const direction = (sortAsc === 'true' || sortAsc === true) ? 1 : -1;
        sortOptions[sortBy] = direction;
    } else {
        sortOptions = { createdAt: -1 };
    }

    const total = await Model.countDocuments(filter);

    let data = [];
    if (limit === 0) {
        // No limit => fetch all results
        data = await Model.find(filter).sort(sortOptions);
    } else {
        data = await Model.find(filter)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);
    }

    return {
        total,
        page: pageNum,
        rows: data
    };
}

module.exports = { getPaginatedAndFilteredData };
