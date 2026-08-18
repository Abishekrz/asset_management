const { Asset, Category } = require("../../models");

exports.list = async (req, res) => {
    try {
        const assets = await Asset.findAll();

        res.json({
            success: true,
            data: assets
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
        const asset = await Asset.findByPk(req.params.id);

        if (!asset) {
            return res.status(404).json({
                success: false,
                error: "Asset not found"
            });
        }

        res.json({
            success: true,
            data: asset
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
        const asset = await Asset.create({
            asset_name: req.body.asset_name,
            serial_number: req.body.serial_number,
            make: req.body.make,
            model: req.body.model,
            purchase_date: req.body.purchase_date,
            purchase_price: req.body.purchase_price,
            category_id: req.body.category_id,
            status: "IN_STOCK",
            warranty: req.body.warranty
        });

        res.status(201).json({
            success: true,
            data: asset
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
        const [updated] = await Asset.update(
            {
                asset_name: req.body.asset_name,
                serial_number: req.body.serial_number,
                make: req.body.make,
                model: req.body.model,
                purchase_date: req.body.purchase_date,
                purchase_price: req.body.purchase_price,
                category_id: req.body.category_id,
                status: req.body.status,
                warranty: req.body.warranty
            },
            {
                where: {
                    asset_id: req.params.id
                }
            }
        );

        if (!updated) {
            return res.status(404).json({
                success: false,
                error: "Asset not found"
            });
        }

        const asset = await Asset.findByPk(req.params.id);

        res.json({
            success: true,
            data: asset
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
        const deleted = await Asset.destroy({
            where: {
                asset_id: req.params.id
            }
        });

        if (!deleted) {
            return res.status(404).json({
                success: false,
                error: "Asset not found"
            });
        }

        res.json({
            success: true,
            message: "Asset deleted successfully"
        });
    } catch (err) {
        console.error(err);

        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};