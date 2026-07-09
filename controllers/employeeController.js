const Employee = require("../models/Employee");

// Display all employees
exports.listEmployees = async (req, res) => {
    try {
        const employees = await Employee.findAll();

        res.render("employee/list", {
            employees
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
        await Employee.create({
            employee_name: req.body.employee_name,
            email: req.body.email,
            department: req.body.department,
            branch: req.body.branch,
            status: req.body.status,
            joined_at: req.body.joined_at
        });
        res.redirect("/employee/list");
    }
    catch(err){
        console.log(err);
    }
};

exports.changeStatus = async (req, res) => {
    try {

        const employee = await Employee.findByPk(req.params.id);
        if (!employee) {
            return res.status(404).send("Employee not found");
        }
        const newStatus =
            employee.status === "ACTIVE"
                ? "INACTIVE"
                : "ACTIVE";
        await Employee.update(
            { status: newStatus },
            {
                where: {
                    employee_id: req.params.id
                }
            }
        );
        res.redirect("/employee/list");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error updating status");
    }
};
exports.editEmployee = async (req, res) => {
    try {

        const employee = await Employee.findByPk(req.params.id);

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

        await Employee.update(
            {
                employee_name: req.body.employee_name,
                email: req.body.email,
                department: req.body.department,
                branch: req.body.branch,
                status: req.body.status,
                joined_at: req.body.joined_at
            },
            {
                where: {
                    employee_id: req.params.id
                }
            }
        );

        res.redirect("/employee/list");

    } catch (err) {
        console.log(err);
        res.status(500).send("Error updating employee");
    }
};