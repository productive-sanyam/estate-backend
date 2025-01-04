// services/baseService.js
class BaseService {
    constructor(MainModel, ExtnModel = null) {
        this.MainModel = MainModel;
        this.ExtnModel = ExtnModel; // optional
    }

    async create(data) {
        return this.MainModel.create(data);
    }

    async list(queryParams) {
        const { createFilterFromQuery } = require('../utils/filterUtil');
        const { getPaginatedAndFilteredData } = require('../utils/paginationUtils');
        const filter = createFilterFromQuery(this.MainModel, queryParams);
        const { page, rows, sortBy, sortAsc } = queryParams;
        return getPaginatedAndFilteredData(this.MainModel, filter, page, rows, sortBy, sortAsc);
    }


    async getById(id) {
        return this.MainModel.findById(id);
    }

    async updateById(id, data) {
        // If you only want to do a simple update with no concurrency checks nor extn logic:
        return this.MainModel.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteById(id) {
        return this.MainModel.findByIdAndDelete(id);
    }


    async findByIdAndCheckVersion(id, reqVersion, notFoundMessage = 'Record not found') {
        const currentRecord = await this.MainModel.findById(id);
        if (!currentRecord) {
            throw new Error(notFoundMessage);
        }
        if (reqVersion === undefined || reqVersion !== currentRecord.version) {
            throw new Error('You are trying to update a record that has changed');
        }
        return currentRecord;
    }

    async updateRecord(id, payload) {
        const { extnData, version: reqVersion, ...mainData } = payload;

        const currentMain = await this.findByIdAndCheckVersion(id, reqVersion, 'Main record not found');

        Object.assign(currentMain, mainData);

        const updatedMain = await currentMain.save();

        if (this.ExtnModel && extnData) {
            const { version: reqExtnVersion, ...extnFields } = extnData;

            let extnRecord = await this.ExtnModel.findById(id);
            if (!extnRecord) {
                extnRecord = new this.ExtnModel({ _id: id });
            } else {
                if (reqExtnVersion === undefined || reqExtnVersion !== extnRecord.version) {
                    throw new Error('You are trying to update a record that has changed (extn)');
                }
            }
            Object.assign(extnRecord, extnFields);
            await extnRecord.save();
        }

        return updatedMain;
    }

    async deleteAll() {
        return this.MainModel.deleteMany();
    }
}

module.exports = BaseService;
