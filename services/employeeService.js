const BaseService = require("./BaseService");
const { Employee } = require("../models");
const { Op } = require("sequelize");

const normalize = (value) => String(value || "").trim().toLowerCase();

class EmployeeService extends BaseService {
    constructor() {
        super(Employee, "employee_id");
    }

    async findByEmail(email, excludeEmployeeId = null) {
        const conditions = [{ email: normalize(email) }];
        if (excludeEmployeeId !== null) {
            conditions.push({ employee_id: { [Op.ne]: excludeEmployeeId } });
        }
        const employee = await this.model.findOne({ where: { [Op.and]: conditions } });
        return employee;
    }

    async findByName(employeeName) {
        const employees = await this.model.findAll({
            where: this.model.sequelize.where(
                this.model.sequelize.fn("lower", this.model.sequelize.fn("btrim", this.model.sequelize.col("employee_name"))),
                normalize(employeeName)
            ),
            order: [["employee_id", "ASC"]],
            limit: 2
        });
        return employees;
    }

    async create(data, transaction = null) {
        const email = normalize(data.email);
        if (!email) return { success: false, error: "Employee email is required." };
        if (await this.findByEmail(email)) return { success: false, error: "Employee email already exists." };
        return super.create({ ...data, email }, transaction);
    }

    async update(id, data, transaction = null) {
        const email = normalize(data.email);
        if (!email) return { success: false, error: "Employee email is required." };
        if (await this.findByEmail(email, id)) return { success: false, error: "Employee email already exists." };
        return super.update(id, { ...data, email }, transaction);
    }
}
module.exports = new EmployeeService();
