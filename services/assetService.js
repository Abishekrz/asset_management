const BaseService = require("./BaseService");
const { Asset, Category } = require("../models");
class AssetService extends BaseService {
    constructor() {
        super(Asset, "asset_id");
    }

    async list() {
        return await super.list({
            include: [
                {
                    model: Category
                }
            ]
        });
    }
    async get(id) {
        return await super.get(id, {
            include: [
                {
                    model: Category
                }
            ]
        });
    }

    async assetExists(serialNumber) {
        if (!serialNumber) return false;
        return await this.exists({ serial_number: String(serialNumber).trim() });
    }

    async findBySerial(serialNumber) {
        const normalized = String(serialNumber || "").trim();
        if (!normalized) return null;

        const result = await this.findOne({ serial_number: normalized });
        if (!result.success) return null;

        return result.data;
    }
}
module.exports = new AssetService();