const { Scrape, Asset } = require("../models");
class ScrapeService {
    async list() {
        try {
            const scrapes = await Scrape.findAll({
                include: [
                    {
                        model: Asset
                    }
                ]
            });
            return {
                success: true,
                data: scrapes
            };
        }
        catch (err) {
            return {
                success: false,
                error: err.message
            };
        }
    }
    async get(scrape_id) {
        try {
            const scrape = await Scrape.findByPk(scrape_id);
            if (!scrape) {
                return {
                    success: false,
                    error: "Scrape record not found."
                };
            }
            return {
                success: true,
                data: scrape
            };
        }
        catch (err) {
            return {
                success: false,
                error: err.message
            };
        }
    }
    async create(data) {
        try {
            const asset = await Asset.findByPk(data.asset_id);
            if (!asset) {
                return {
                    success: false,
                    error: "Asset not found."
                };
            }
            const scrape = await Scrape.create({
                asset_id: data.asset_id,
                scrape_date: data.scrape_date,
                reason: data.reason
            });
            await asset.update({
                status: "SCRAPPED"
            });
            return {
                success: true,
                data: scrape
            };
        }
        catch (err) {
            return {
                success: false,
                error: err.message
            };
        }
    }
    async update(scrape_id, data) {
        try {
            const scrape = await Scrape.findByPk(scrape_id);
            if (!scrape) {
                return {
                    success: false,
                    error: "Scrape record not found."
                };
            }
            await scrape.update({
                scrape_date: data.scrape_date,
                reason: data.reason
            });
            return {
                success: true,
                data: scrape
            };
        }
        catch (err) {
            return {
                success: false,
                error: err.message
            };
        }
    }
    async delete(scrape_id) {
        try {
            const scrape = await Scrape.findByPk(scrape_id);
            if (!scrape) {
                return {
                    success: false,
                    error: "Scrape record not found."
                };
            }
            await Asset.update(
                {
                    status: "IN_STOCK"
                },
                {
                    where: {
                        asset_id: scrape.asset_id
                    }
                }
            );
            await scrape.destroy();
            return {
                success: true
            };
        }
        catch (err) {
            return {
                success: false,
                error: err.message
            };
        }
    }
}
module.exports = new ScrapeService();