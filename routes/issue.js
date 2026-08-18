const express = require("express");
const router = express.Router();

const issueController = require("../controllers/issueController");

router.get("/history", issueController.listIssue);
router.post("/issue", issueController.issueAsset);
router.post("/return", issueController.returnAsset);
router.post("/edit/:id", issueController.updateIssue);
router.get("/delete/:id", issueController.deleteIssue);
router.get("/find", issueController.findIssue);
router.get("/:id", issueController.getIssue);


module.exports = router;