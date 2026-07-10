const { Scrape, Asset } = require("../models");
// List all scrapped assets
exports.listScrape = async (req, res) => {
    try {
        const assets = await Asset.findAll();
        const scrapes = await Scrape.findAll({include: [{model: Asset}]}
        );
        
        res.render("scrape/list", {
            scrapes,
            assets
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error loading scrap history");
    }
};  
exports.getScrape = async (req, res) => {
    try {
        const scrape = await Scrape.findByPk(req.params.id
            // ,
            // {
            //     include: [{
            //     model: Asset
            // }]
            // }
        );
        if (!scrape) {
            return res.status(404).json({
                success: false,
                message: "Scrap record not found"
            });
        }
        res.json(scrape);
        console.log(scrape)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false
        });
    }
};
exports.addScrape = async (req, res) => {
    try {
        await Scrape.create({
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
        res.redirect("/scrape/list");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error scrapping asset");
    }
};
exports.updateScrape = async (req, res) => {
    try {
        await Scrape.update(
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
        res.redirect("/scrape/list");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error updating scrap record");
    }
};
exports.deleteScrape = async (req, res) => {
    try {
        const scrape = await Scrape.findByPk(req.params.id);
        if (!scrape) {
            return res.status(404).send("Scrap record not found");
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
        res.redirect("/scrape/list");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error deleting scrap record");
    }
};