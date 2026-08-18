const Employee = require("../models/Employee");
const Asset = require("../models/Asset");
const Issue = require("../models/Issue");

exports.dashboard = async (req, res) => {
    try {

        const totalEmployees = await Employee.count();

        const totalAssets = await Asset.count();

        const stockAssets = await Asset.count({
            where: {
                status: "IN_STOCK"
            }
        });

        const issuedAssets = await Asset.count({
            where: {
                status: "ISSUED"
            }
        });

        const repairAssets = await Asset.count({
            where: {
                status: "REPAIR"
            }
        });

        const scrapAssets = await Asset.count({
            where: {
                status: "SCRAPPED"
            }
        });

        const totalIssues = await Issue.count();

        res.render("dashboard", {
            totalEmployees,
            totalAssets,
            stockAssets,
            issuedAssets,
            repairAssets,
            scrapAssets,
            totalIssues
        });
        

    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading dashboard");
    }
};
exports.dashboardApi = async (req, res) => {
    try {
        const totalEmployees = await Employee.count();

        const totalAssets = await Asset.count();

        const stockAssets = await Asset.count({
            where: {
                status: "IN_STOCK"
            }
        });

        const issuedAssets = await Asset.count({
            where: {
                status: "ISSUED"
            }
        });

        const repairAssets = await Asset.count({
            where: {
                status: "REPAIR"
            }
        });

        const scrapAssets = await Asset.count({
            where: {
                status: "SCRAPPED"
            }
        });

        const totalIssues = await Issue.count();

        res.json({
            success: true,
            data: {
                totalEmployees,
                totalAssets,
                stockAssets,
                issuedAssets,
                repairAssets,
                scrapAssets,
                totalIssues
            }
        });

    } catch (err) {
        console.error("Dashboard API Error:", err);

        res.status(500).json({
            success: false,
            error: "Error loading dashboard data"
        });
    }
};