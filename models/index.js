const Employee = require("./Employee");
const Category = require("./Category");
const Asset = require("./Asset");
const Issue = require("./Issue");
Category.hasMany(Asset, {
    foreignKey: "category_id"
});
Asset.belongsTo(Category, {
    foreignKey: "category_id"
});
Employee.hasMany(Issue, {
    foreignKey: "employee_id"
});
Issue.belongsTo(Employee, {
    foreignKey: "employee_id"
});
Asset.hasMany(Issue, {
    foreignKey: "asset_id"
});
Issue.belongsTo(Asset, {
    foreignKey: "asset_id"
});
module.exports = {
    Employee,
    Category,
    Asset,
    Issue
};