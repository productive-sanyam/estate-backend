// File: utils/paginationUtils.js

async function getPaginatedAndFilteredData(Model, filter, page = 1, rows = 5) {
    const pageNum = parseInt(page, 10) || 1;
    const rowsNum = parseInt(rows, 10) || 5;

    // If rows = -1 => return all
    const limit = rowsNum === -1 ? 0 : rowsNum;
    const skip = (pageNum - 1) * rowsNum;

    const total = await Model.countDocuments(filter);

    let data = [];
    if (limit === 0) {
        data = await Model.find(filter);
    } else {
        data = await Model.find(filter).skip(skip).limit(limit);
    }

    return {
        total,
        page: pageNum,
        rows: data
    };
}

module.exports = { getPaginatedAndFilteredData };
