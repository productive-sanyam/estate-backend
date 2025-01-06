const Property = require('./Property');
const mongoose = require('mongoose');

/**
 * Generates statistics based on the provided StatsRequest.
 * @param {Object} statsRequest - The statistics request parameters.
 * @returns {Array} - The result of the aggregation pipeline.
 */
const generateStats = async (statsRequest) => {
    const pipeline = buildAggregationPipeline(statsRequest);
    const stats = await Property.aggregate(pipeline).exec();
    return stats;
};

/**
 * Builds the MongoDB aggregation pipeline based on the StatsRequest.
 * @param {Object} statsRequest - The statistics request parameters.
 * @returns {Array} - The aggregation pipeline.
 */
const buildAggregationPipeline = (statsRequest) => {
    const pipeline = [];

    // Match Stage: Apply filters
    const matchStage = buildMatchStage(statsRequest);
    if (matchStage) {
        pipeline.push({ $match: matchStage });
    }

    // Unwind Stage: If specified
    if (statsRequest.unwind) {
        pipeline.push({ $unwind: `$${statsRequest.unwind}` });
    }

    // Group Stage: Define grouping and aggregations
    const groupStage = buildGroupStage(statsRequest);
    if (groupStage) {
        pipeline.push(groupStage);
    }

    // Sort Stage: Default or based on request
    const sortField = statsRequest.sortBy || '_id';
    const sortOrder = statsRequest.sortAsc === 'false' ? -1 : 1;
    pipeline.push({ $sort: { [sortField]: sortOrder } });

    // Pagination: Skip and Limit
    const page = parseInt(statsRequest.page, 10) || 1;
    const rows = parseInt(statsRequest.rows, 10) || 10;
    pipeline.push({ $skip: (page - 1) * rows });
    pipeline.push({ $limit: rows });

    return pipeline;
};

/**
 * Builds the match criteria for the aggregation pipeline.
 * @param {Object} statsRequest - The statistics request parameters.
 * @returns {Object|null} - The match criteria or null.
 */
const buildMatchStage = (statsRequest) => {
    const { filters, inFilters, notInFilters, btwFilters, existsFilter, ltFilters, gtFilters, caseIgnoreFilters } = statsRequest;
    const match = {};

    // Simple equality filters
    if (filters) {
        Object.keys(filters).forEach((field) => {
            match[field] = filters[field];
        });
    }

    // In Filters
    if (inFilters) {
        Object.keys(inFilters).forEach((field) => {
            match[field] = { $in: inFilters[field] };
        });
    }

    // Not In Filters
    if (notInFilters) {
        Object.keys(notInFilters).forEach((field) => {
            match[field] = { $nin: notInFilters[field] };
        });
    }

    // Between Filters
    if (btwFilters) {
        Object.keys(btwFilters).forEach((field) => {
            const [min, max] = btwFilters[field];
            match[field] = { $gte: min, $lte: max };
        });
    }

    // Exists Filters
    if (existsFilter) {
        Object.keys(existsFilter).forEach((field) => {
            match[field] = { $exists: existsFilter[field] };
        });
    }

    // Less Than Filters
    if (ltFilters) {
        Object.keys(ltFilters).forEach((field) => {
            match[field] = { ...match[field], $lt: ltFilters[field] };
        });
    }

    // Greater Than Filters
    if (gtFilters) {
        Object.keys(gtFilters).forEach((field) => {
            match[field] = { ...match[field], $gt: gtFilters[field] };
        });
    }

    // Case Insensitive Filters
    if (caseIgnoreFilters) {
        Object.keys(caseIgnoreFilters).forEach((field) => {
            match[field] = {
                $regex: new RegExp(`^${caseIgnoreFilters[field]}$`, 'i'),
            };
        });
    }

    return Object.keys(match).length > 0 ? match : null;
};

/**
 * Builds the group stage for the aggregation pipeline.
 * @param {Object} statsRequest - The statistics request parameters.
 * @returns {Object|null} - The group stage or null.
 */
const buildGroupStage = (statsRequest) => {
    const { groupBy, sum, avg } = statsRequest;
    if (!groupBy && !sum && !avg) {
        return null;
    }

    const group = { _id: {} };
    if (groupBy) {
        Object.keys(groupBy).forEach((alias) => {
            group._id[alias] = `$${groupBy[alias]}`;
        });
    } else {
        group._id = null; // Group all documents
    }

    if (sum) {
        group.total = { $sum: `$${sum}` };
    }

    if (avg) {
        group.average = { $avg: `$${avg}` };
    }

    return { $group: group };
};

module.exports = {
    generateStats,
};
