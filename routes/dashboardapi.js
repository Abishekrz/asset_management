const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboardController");

router.get("/stats", dashboardController.dashboardApi);

module.exports = router;