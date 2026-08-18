const { Issue, Asset, Employee } = require("../models");
class IssueService {
    async list() {
        try {
            const issues = await Issue.findAll({
                include: [
                    { model: Asset },
                    { model: Employee }
                ]
            });
            return {
                success: true,
                data: issues
            };
        }
        catch (err) {
            return {
                success: false,
                error: err.message
            };
        }
    }
    async get(issue_id) {
        try {
            const issue = await Issue.findByPk(issue_id, {
                include: [
                    { model: Asset },
                    { model: Employee }
                ]
            });
            if (!issue) {
                return {
                    success: false,
                    error: "Issue record not found."
                };
            }
            return {
                success: true,
                data: issue
            };
        }
        catch (err) {
            return {
                success: false,
                error: err.message
            };
        }
    }
    async issue(data) {
        try {
            const asset = await Asset.findByPk(data.asset_id);
            if (!asset) {
                return {
                    success: false,
                    error: "Asset not found."
                };
            }
            if (asset.status !== "IN_STOCK") {
                return {
                    success: false,
                    error: "Asset is not available."
                };
            }
            const employee = await Employee.findByPk(data.employee_id);
            if (!employee) {
                return {
                    success: false,
                    error: "Employee not found."
                };
            }
            const issue = await Issue.create({
                asset_id: data.asset_id,
                employee_id: data.employee_id,
                issue_date: data.issue_date,
                expected_return_date: data.expected_return_date,
                remarks: data.remarks
            });
            await asset.update({
                status: "ISSUED"
            });
            return {
                success: true,
                data: issue
            };
        }
        catch (err) {
            return {
                success: false,
                error: err.message
            };
        }
    }
    async return(issue_id, return_date) {
        try {
            const issue = await Issue.findByPk(issue_id);
            if (!issue) {
                return {
                    success: false,
                    error: "Issue record not found."
                };
            }
            await issue.update({
                return_date
            });
            await Asset.update(
                {
                    status: "IN_STOCK"
                },
                {
                    where: {
                        asset_id: issue.asset_id
                    }
                }
            );
            return {
                success: true,
                data: issue
            };
        }
        catch (err) {
            return {
                success: false,
                error: err.message
            };
        }
    }
    async delete(issue_id) {
        try {
            const issue = await Issue.findByPk(issue_id);
            if (!issue) {
                return {
                    success: false,
                    error: "Issue record not found."
                };
            }
            await Asset.update(
                {
                    status: "IN_STOCK"
                },
                {
                    where: {
                        asset_id: issue.asset_id
                    }
                }
            );
            await issue.destroy();
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
module.exports = new IssueService();