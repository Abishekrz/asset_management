const express = require("express");
const router = express.Router();

const assetController = require("../controllers/assetController");

router.get("/list", assetController.listAssets);
router.get("/add", assetController.showAddForm);
router.post("/add", assetController.addAsset);
router.get("/check-serial", assetController.checkSerial);
router.get("/find-by-serial", assetController.findBySerial);
router.get("/delete/:id", assetController.deleteAsset);
router.get("/edit/:id", assetController.editAsset);
router.post("/edit/:id", assetController.updateAsset);
router.get("/:id", assetController.getAsset);

module.exports = router;