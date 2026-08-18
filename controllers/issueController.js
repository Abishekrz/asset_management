const { Issue, Employee, Asset, Scrape} = require("../models");

    
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
        const issue = await Issue.findByPk(req.params.id, {
            include: [Asset]
        });
        if (!issue) {
            return res.status(404).json({
                success: false,
                message: "Issue not found"
            });
        }
        res.json({
            issue_id: issue.issue_id,
            employee_id: issue.employee_id,
            asset_id: issue.asset_id,
            issue_date: issue.issue_date,
            return_date: issue.return_date,
            reason: issue.reason,
            asset_name: issue.Asset?.asset_name,
            asset_id: issue.asset_id,
            employee_id: issue.employee_id,
            status: issue.status || "ISSUED"
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false
        });
    }
};

exports.findIssue = async (req, res) => {
    try {
        const issue = await Issue.findOne({
            where: { asset_id: req.query.asset_id },
            include: [Asset, Employee]
        });
        if (!issue) {
            return res.status(404).json({ success: false, error: "Issue not found." });
        }
        res.json({ success: true, issue: {
            issue_id: issue.issue_id,
            employee_id: issue.employee_id,
            asset_id: issue.asset_id,
            issue_date: issue.issue_date,
            expected_return_date: issue.expected_return_date,
            return_date: issue.return_date,
            reason: issue.reason,
            asset_name: issue.Asset?.asset_name,
            employee_name: issue.Employee?.employee_name,
            status: issue.status || "ISSUED"
        }});
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
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
            return res.status(404).send("No active issue found.");
        }
        // Update issue details
        await issue.update({
            return_date: req.body.return_date,
            reason: req.body.reason
        });
        // Update asset status
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
        // Create scrap record if asset is scrapped
        if (req.body.status === "SCRAPPED") {
            const existingScrape = await Scrape.findOne({
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
                status: status
            },
            {
                where: {
                    asset_id: req.body.asset_id
                }
            }
        );
        // Create scrap record only if asset is scrapped
        console.log("Status =", req.body.status);
        if (status === "SCRAPPED") {
            console.log("Creating Scrap Record...");
            const existingScrape = await Scrape.findOne({
                where: {
                    asset_id: req.body.asset_id
                }
            });
            console.log(existingScrape)
            if (!existingScrape) {
                await Scrape.create({
                    asset_id: req.body.asset_id,
                    scrape_date: req.body.return_date,
                    reason: req.body.reason
                });
                console.log("Scrap Record Created");
            }
        }
        res.redirect("/issue/history");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error updating issue");
    }
};