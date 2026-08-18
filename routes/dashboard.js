const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboardController");

// Existing Jade dashboard
router.get("/", dashboardController.dashboard);

// React API
router.get("/stats", dashboardController.dashboardApi);

module.exports = router;