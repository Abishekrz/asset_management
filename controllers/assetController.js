const { Asset, Category } = require("../models");
const assetService = require("../services/assetService");

// Display all employees
exports.listAssets= async (req, res) => {
    try {
        const assets = await Asset.findAll();
        const categories = await Category.findAll();
        res.render("asset/list", {
            assets,
            categories
        });
        // console.log(assets)
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching Assets");
    }
};
exports.getAsset = async (req, res) => {

    try {

        const asset = await Asset.findByPk(req.params.id);

        res.json(asset);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false
        });

    }

};

exports.checkSerial = async (req, res) => {
    try {
        const exists = await assetService.assetExists(req.query.serial_number);
        res.json({ success: true, exists });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.findBySerial = async (req, res) => {
    try {
        const asset = await assetService.findBySerial(req.query.serial_number);
        if (!asset) return res.status(404).json({ success: false, error: "Asset not found." });
        res.json({ success: true, data: asset });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// Show Add Employee page
exports.showAddForm = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.render("asset/add", {
            categories
        });
    } catch (err) {
        console.log(err);
    }

};

exports.addAsset = async (req, res) => {
    try {
        await Asset.create({
            asset_name: req.body.asset_name,
            serial_number: req.body.serial_number,
            make: req.body.make,
            model: req.body.model,
            purchase_date: req.body.purchase_date,
            purchase_price: req.body.purchase_price,
            category_id: req.body.category_id,
            status: "IN_STOCK"
        });
        res.redirect("/asset/list");
    } catch (err) {
        console.log(err);
    }
};

exports.deleteAsset = async (req, res) => {
    try {
        await Asset.destroy({
            where: {
                asset_id: req.params.id
            }
        });
        res.redirect("/asset/list");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error deleting Asset");
    }
};

exports.editAsset = async (req, res) => {
    try {

        const asset = await Asset.findByPk(req.params.id);

        const categories = await Category.findAll();

        res.render("asset/edit", {
            asset,
            categories
        });

    } catch (err) {
        console.log(err);
    }
};
exports.updateAsset = async (req, res) => {

    try {

        await Asset.update(
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

        res.redirect("/asset/list");

    } catch (err) {
        console.log(err);
    }

};