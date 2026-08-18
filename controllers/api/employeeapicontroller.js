const employeeService = require("../../services/employeeService");

exports.list = async (req, res) => {
    try {
        const result = await employeeService.list();

        if (!result.success) {
            return res.status(400).json(result);
        }

        res.json({
            success: true,
            data: result.data
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
        const result = await employeeService.get(req.params.id);

        if (!result.success || !result.data) {
            return res.status(404).json({
                success: false,
                error: "Employee not found"
            });
        }

        res.json({
            success: true,
            data: result.data
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

        const data = {
            employee_name: req.body.employee_name,
            email: req.body.email,
            department: req.body.department,
            branch: req.body.branch,
            status: req.body.status || "ACTIVE",
            joined_at: req.body.joined_at || null
        };


        const result = await employeeService.create(data);


        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.status(201).json(result);

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

exports.update = async (req, res) => {
    try {
        const result = await employeeService.update(
            req.params.id,
            {
                employee_name: req.body.employee_name,
                email: req.body.email,
                department: req.body.department,
                branch: req.body.branch,
                status: req.body.status,
                joined_at: req.body.joined_at
            }
        );

        if (!result.success) {
            return res.status(400).json(result);
        }

        res.json(result);
    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

exports.changeStatus = async (req, res) => {
    try {
        const result = await employeeService.get(req.params.id);

        if (!result.success || !result.data) {
            return res.status(404).json({
                success: false,
                error: "Employee not found"
            });
        }

        const employee = result.data;

        const newStatus =
            employee.status === "ACTIVE"
                ? "INACTIVE"
                : "ACTIVE";

        const updateResult = await employeeService.update(
            req.params.id,
            {
                ...employee.toJSON(),
                status: newStatus
            }
        );

        res.json(updateResult);
    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};