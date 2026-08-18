class BaseService {
    constructor(model, primaryKey) {
        this.model = model;
        this.primaryKey = primaryKey;
    }
    async list(options = {}) {
        try {
            const records = await this.model.findAll(options);
            return {
                success: true,
                data: records
            };
        }
        catch (err) {
            return {
                success: false,
                error: err.message
            };
        }
    }
    async get(id, options = {}) {
        try {
            const record = await this.model.findByPk(
                id,
                options
            );
            if (!record) {
                return {
                    success: false,
                    error: "Record not found."
                };
            }
            return {
                success: true,
                data: record
            };
        }
        catch (err) {
            return {
                success: false,
                error: err.message
            };
        }
    }
    async findOne(where, options = {}) {
        try {
            const record = await this.model.findOne({
                where,
                ...options
            });
            if (!record) {
                return {
                    success: false,
                    error: "Record not found."
                };
            }
            return {
                success: true,
                data: record
            };
        }
        catch (err) {
            return {
                success: false,
                error: err.message
            };
        }
    }
    async create(data, transaction = null) {
        try {
            const record = await this.model.create(
                data,
                {
                    transaction
                }
            );
            return {
                success: true,
                data: record
            };
        }
        catch (err) {
            return {
                success: false,
                error: err.message
            };
        }
    }
    async update(id, data, transaction = null) {
        try {
            const where = {};
            where[this.primaryKey] = id;
            const [updated] = await this.model.update(
                data,
                {
                    where,
                    transaction
                }
            );
            if (!updated) {
                return {
                    success: false,
                    error: "Record not found."
                };
            }
            return await this.get(id);
        }
        catch (err) {
            return {
                success: false,
                error: err.message
            };
        }
    }
    async delete(id, transaction = null) {
        try {
            const where = {};
            where[this.primaryKey] = id;
            const deleted = await this.model.destroy({
                where,
                transaction
            });
            if (!deleted) {
                return {
                    success: false,
                    error: "Record not found."
                };
            }
            return {
                success: true,
                message: "Deleted successfully."
            };
        }
        catch (err) {
            return {
                success: false,
                error: err.message
            };
        }
    }
    async count(where = {}) {
        try {
            const total = await this.model.count({
                where
            });
            return {
                success: true,
                data: total
            };
        }
        catch (err) {
            return {
                success: false,
                error: err.message
            };
        }
    }
    async exists(where) {
        try {
            const count = await this.model.count({
                where
            });
            return count > 0;
        }
        catch {
            return false;
        }
    }
}
module.exports = BaseService;