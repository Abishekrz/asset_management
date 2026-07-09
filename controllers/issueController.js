const { Issue, Employee, Asset } = require("../models");

    
exports.listIssue = async (req, res) => {
    try {

        const issues = await Issue.findAll({include: [
                {
                    model: Employee
                },
                {
                    model: Asset
                }
            ]});

        const assets = await Asset.findAll();

        const employees = await Employee.findAll();

        res.render("issue/history", {
            issues,
            assets,
            employees
        });

    } catch (err) {
        console.log(err);
        res.status(500).send("Error loading history");
    }
};


exports.showIssueForm = async (req, res) => {
    try {
        const employees = await Employee.findAll();
        const assets = await Asset.findAll({
            where: {
                status: "IN_STOCK"
            }
        });
        res.render("issue/issue", {
            employees,
            assets
        });
    } catch (err) {
        console.log(err);
    }
};

exports.getIssue = async (req, res) => {
    try {
        const issue = await Issue.findByPk(req.params.id);
        if (!issue) {
            return res.status(404).json({
                success: false,
                message: "Issue not found"
            });
        }
        res.json(issue);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

exports.issueAsset = async (req, res) => {
    try {
        await Issue.create({
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
        res.redirect("/issue/history");
    }
    catch(err){
        console.log(err);
    }
};

exports.showReturnForm = async (req, res) => {

    try {

        const issues = await Issue.findAll({
            where: {
                return_date: null
            },
            include: [Employee, Asset]
        });

        res.render("issue/return", {
            issues
        });

    } catch (err) {
        console.log(err);
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
            return res.status(404).send("No active issue found for this asset.");
        }
        await issue.update({
            return_date: req.body.return_date,
            reason: req.body.reason
        });
        await Asset.update(
            {
                status: "IN_STOCK"
            },
            {
                where: {
                    asset_id: req.body.asset_id
                }
            }
        );
        res.redirect("/issue/history");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error returning asset");
    }
};
exports.deleteIssue = async (req, res) => {
    try {
        await Issue.destroy({
            where: {
                issue_id: req.params.id
            }
        });
        res.redirect("/issue/history");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error deleting Issue");
    }
};

exports.editIssue = async (req, res) => {
    try {
        const issue = await Issue.findByPk(req.params.id, {
            include: [
                {
                    model: Asset
                }
            ]
        });

        if (issue.return_date) {
                issue.return_date = issue.return_date.substring(0, 10);
            }
        const employees = await Employee.findAll();
        const assets = await Asset.findAll();
        res.render("issue/edit", {
            issue,
            employees,
            assets
        });
    } catch (err) {
        console.log(err);
    }
};
exports.updateIssue = async (req, res) => {

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
        await Issue.update(data, {
            where: {
                issue_id: req.params.id
            }
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
        res.redirect("/issue/history");
    } catch (err) {
        console.log(err);
    }
};