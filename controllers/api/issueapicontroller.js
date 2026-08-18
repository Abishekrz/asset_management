const {
    Issue,
    Employee,
    Asset,
    Scrape
} = require("../../models");

exports.list = async (req, res) => {
    try {
        const issues = await Issue.findAll({
            include: [
                {
                    model: Employee
                },
                {
                    model: Asset
                }
            ]
        });

        res.json({
            success: true,
            data: issues
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
        const issue = await Issue.findByPk(
            req.params.id,
            {
                include: [Employee, Asset]
            }
        );

        if (!issue) {
            return res.status(404).json({
                success: false,
                error: "Issue not found"
            });
        }

        res.json({
            success: true,
            data: issue
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
        const issue = await Issue.create({
            asset_id: req.body.asset_id,
            employee_id: req.body.employee_id,
            issue_date: req.body.issue_date,
            reason: req.body.reason
        });

        await Asset.update(
            {
                status: "ISSUED"
            },
            {
                where: {
                    asset_id: req.body.asset_id
                }
            }
        );

        res.status(201).json({
            success: true,
            data: issue
        });
    } catch (err) {
        console.error(err);

        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

exports.returnAsset = async (req, res) => {
    try {
        const issue = await Issue.findOne({
            where: {
                asset_id: req.body.asset_id,
                return_date: null
            }
        });

        if (!issue) {
            return res.status(404).json({
                success: false,
                error: "No active issue found"
            });
        }

        await issue.update({
            return_date: req.body.return_date,
            reason: req.body.reason
        });

        await Asset.update(
            {
                status: req.body.status
            },
            {
                where: {
                    asset_id: req.body.asset_id
                }
            }
        );

        if (req.body.status === "SCRAPPED") {
            const existingScrape =
                await Scrape.findOne({
                    where: {
                        asset_id: req.body.asset_id
                    }
                });

            if (!existingScrape) {
                await Scrape.create({
                    asset_id: req.body.asset_id,
                    scrape_date: req.body.return_date,
                    reason: req.body.reason
                });
            }
        }

        res.json({
            success: true,
            data: issue
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
        const data = {
            employee_id: req.body.employee_id,
            asset_id: req.body.asset_id,
            issue_date: req.body.issue_date,
            reason: req.body.reason
        };

        if (req.body.return_date) {
            data.return_date = req.body.return_date;
        }

        const [updated] = await Issue.update(
            data,
            {
                where: {
                    issue_id: req.params.id
                }
            }
        );

        if (!updated) {
            return res.status(404).json({
                success: false,
                error: "Issue not found"
            });
        }

        let status = "IN_STOCK";

        switch (req.body.reason) {
            case "Needs Repair":
                status = "REPAIR";
                break;

            case "Scrapped":
                status = "SCRAPPED";
                break;
        }

        await Asset.update(
            {
                status
            },
            {
                where: {
                    asset_id: req.body.asset_id
                }
            }
        );

        const issue = await Issue.findByPk(
            req.params.id
        );

        res.json({
            success: true,
            data: issue
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
        const deleted = await Issue.destroy({
            where: {
                issue_id: req.params.id
            }
        });

        if (!deleted) {
            return res.status(404).json({
                success: false,
                error: "Issue not found"
            });
        }

        res.json({
            success: true,
            message: "Issue deleted successfully"
        });
    } catch (err) {
        console.error(err);

        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};