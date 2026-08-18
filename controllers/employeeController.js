const employeeService = require("../services/employeeService");

// Display all employees
exports.listEmployees = async (req, res) => {
    try {
        const result = await employeeService.list();
        if (!result.success) throw new Error(result.error);

        res.render("employee/list", {
            employees: result.data
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching employees");
    }
};

// Show Add Form
exports.showAddForm = (req, res) => {
    res.render("employee/add");
};

// Add Employee
exports.addEmployee = async (req, res) => {
    try {
        const result = await employeeService.create({
            employee_name: req.body.employee_name,
            email: req.body.email,
            department: req.body.department,
            branch: req.body.branch,
            status: req.body.status,
            joined_at: req.body.joined_at
        });
        if (!result.success) return res.status(400).send(result.error);
        res.redirect("/employee/list");
    }
    catch(err){
        console.log(err);
    }
};

exports.changeStatus = async (req, res) => {
    try {

        const result = await employeeService.get(req.params.id);
        const employee = result.data;
        if (!employee) {
            return res.status(404).send("Employee not found");
        }
        const newStatus =
            employee.status === "ACTIVE"
                ? "INACTIVE"
                : "ACTIVE";
        await employeeService.update(req.params.id, { ...employee.toJSON(), status: newStatus });
        res.redirect("/employee/list");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error updating status");
    }
};
exports.editEmployee = async (req, res) => {
    try {

        const result = await employeeService.get(req.params.id);
        const employee = result.data;

        if (!employee) {
            return res.status(404).send("Employee not found");
        }

        res.json(employee);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error loading employee");
    }
};
exports.updateEmployee = async (req, res) => {
    try {

        const result = await employeeService.update(req.params.id, {
                employee_name: req.body.employee_name,
                email: req.body.email,
                department: req.body.department,
                branch: req.body.branch,
                status: req.body.status,
                joined_at: req.body.joined_at
            });
        if (!result.success) return res.status(400).send(result.error);

        res.redirect("/employee/list");

    } catch (err) {
        console.log(err);
        res.status(500).send("Error updating employee");
    }
};

exports.checkEmail = async (req, res) => {
    const employee = await employeeService.findByEmail(req.query.email);
    res.json({ success: true, exists: Boolean(employee) });
};

exports.findByName = async (req, res) => {
    const employees = await employeeService.findByName(req.query.employee_name);
    if (employees.length === 0) return res.status(404).json({ success: false, error: "Employee not found." });
    if (employees.length > 1) return res.status(409).json({ success: false, error: "Multiple employees have this name. Use an employee ID." });
    res.json({ success: true, data: employees[0] });
};
