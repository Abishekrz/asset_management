const express = require("express");
const router = express.Router();

const employeeController = require("../controllers/employeeController");

router.get("/list", employeeController.listEmployees);
router.post("/add", employeeController.addEmployee);
router.get("/:id", employeeController.editEmployee);
router.post("/edit/:id", employeeController.updateEmployee);
router.get("/changestatus/:id", employeeController.changeStatus);
module.exports = router;