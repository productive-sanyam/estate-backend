// services/baseService.js
class BaseService {
    constructor(Model) {
        this.Model = Model;
    }

    async create(data) {
        return this.Model.create(data);
    }

    async list(queryParams) {
        const { createFilterFromQuery } = require('../utils/filterUtil');
        const { getPaginatedAndFilteredData } = require('../utils/paginationUtils');
        const filter = createFilterFromQuery(this.Model, queryParams);
        const page = queryParams.page;
        const rows = queryParams.rows;

        const result = await getPaginatedAndFilteredData(this.Model, filter, page, rows);

        return result;
    }

    async getById(id) {
        return this.Model.findById(id);
    }

    async updateById(id, data) {
        return this.Model.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteById(id) {
        return this.Model.findByIdAndDelete(id);
    }

    /**
     * Check concurrency in a generic way.
     * 1) Find record by id
     * 2) If not found, throw error
     * 3) Compare version with reqVersion
     * 4) If mismatch, throw error
     * 5) Return the record
     */
    async findByIdAndCheckVersion(id, reqVersion, notFoundMessage = 'Record not found') {
        const currentRecord = await this.Model.findById(id);
        if (!currentRecord) {
            throw new Error(notFoundMessage);
        }
        if (reqVersion === undefined || reqVersion !== currentRecord.version) {
            throw new Error('You are trying to update a record that has changed');
        }
        return currentRecord;
    }
}

module.exports = BaseService;
