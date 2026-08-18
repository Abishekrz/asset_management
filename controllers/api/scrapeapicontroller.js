const {
    Scrape,
    Asset
} = require("../../models");

exports.list = async (req, res) => {
    try {
        const scrapes = await Scrape.findAll({
            include: [
                {
                    model: Asset
                }
            ]
        });

        res.json({
            success: true,
            data: scrapes
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

exports.get = async (req, res) => {
    try {
        const scrape = await Scrape.findByPk(
            req.params.id,
            {
                include: [Asset]
            }
        );

        if (!scrape) {
            return res.status(404).json({
                success: false,
                error: "Scrap record not found"
            });
        }

        res.json({
            success: true,
            data: scrape
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

exports.create = async (req, res) => {
    try {
        const scrape = await Scrape.create({
            asset_id: req.body.asset_id,
            scrape_date: req.body.scrape_date,
            reason: req.body.reason
        });

        await Asset.update(
            {
                status: "SCRAPPED"
            },
            {
                where: {
                    asset_id: req.body.asset_id
                }
            }
        );

        res.status(201).json({
            success: true,
            data: scrape
        });
    } catch (err) {
        console.error(err);

        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

exports.update = async (req, res) => {
    try {
        const [updated] = await Scrape.update(
            {
                scrape_date: req.body.scrape_date,
                reason: req.body.reason
            },
            {
                where: {
                    scrape_id: req.params.id
                }
            }
        );

        if (!updated) {
            return res.status(404).json({
                success: false,
                error: "Scrap record not found"
            });
        }

        const scrape = await Scrape.findByPk(
            req.params.id
        );

        res.json({
            success: true,
            data: scrape
        });
    } catch (err) {
        console.error(err);

        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

exports.delete = async (req, res) => {
    try {
        const scrape = await Scrape.findByPk(
            req.params.id
        );

        if (!scrape) {
            return res.status(404).json({
                success: false,
                error: "Scrap record not found"
            });
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

        res.json({
            success: true,
            message: "Scrap record deleted successfully"
        });
    } catch (err) {
        console.error(err);

        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};