const categoryService = require("./categoryService");
const employeeService = require("./employeeService");
const assetService = require("./assetService");
const issueService = require("./issueService");
const scrapeService = require("./scrapeService");
class Dispatcher {

    async dispatch(ai) {
        if (!ai || !ai.tool) {
            return {
                success: false,
                error: "Invalid AI request."
            };
        }
        switch (ai.tool) {
            case "add_category":
                return await categoryService.create(ai.arguments);
            case "update_category":
                return await categoryService.updateCategory(ai.arguments);
            case "delete_category":
                return await categoryService.delete(ai.arguments.category_id);
            case "get_category":
                return await categoryService.get(ai.arguments.category_id);
            case "list_category":
                return await categoryService.list();
            case "add_employee":
                return await employeeService.create(ai.arguments);
            case "update_employee":
                return await employeeService.update(
                    ai.arguments.employee_id,
                    ai.arguments
                );
            case "delete_employee":
                return await employeeService.delete(ai.arguments.employee_id);
            case "get_employee":
                return await employeeService.get(ai.arguments.employee_id);
            case "list_employee":
                return await employeeService.list();
            case "add_asset":
                return await assetService.create(ai.arguments);
            case "update_asset":
                return await assetService.update(
                    ai.arguments.asset_id,
                    ai.arguments
                );
            case "delete_asset":
                return await assetService.delete(ai.arguments.asset_id);
            case "get_asset":
                return await assetService.get(ai.arguments.asset_id);
            case "list_asset":
                return await assetService.list();
            case "issue_asset":
                return await issueService.issue(ai.arguments);
            case "return_asset":
                return await issueService.return(
                    ai.arguments.issue_id,
                    ai.arguments.return_date
                );
            case "delete_issue":
                return await issueService.delete(ai.arguments.issue_id);
            case "get_issue":
                return await issueService.get(ai.arguments.issue_id);
            case "list_issue":
                return await issueService.list();
            case "scrape_asset":
                return await scrapeService.create(ai.arguments);
            case "update_scrape":
                return await scrapeService.update(
                    ai.arguments.scrape_id,
                    ai.arguments
                );
            case "delete_scrape":
                return await scrapeService.delete(ai.arguments.scrape_id);
            case "get_scrape":
                return await scrapeService.get(ai.arguments.scrape_id);
            case "list_scrape":
                return await scrapeService.list();
            default:
                return {
                    success: false,
                    error: `Unsupported AI tool: ${ai.tool}`
                };
        }
    }
}
module.exports = new Dispatcher();