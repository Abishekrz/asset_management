const express = require("express");

const router = express.Router();

const controller = require("../../controllers/api/issueApiController");

router.get("/", controller.list);
router.get("/:id", controller.get);

router.post("/", controller.create);

router.post("/:id/return", controller.returnAsset);

router.put("/:id", controller.update);

router.delete("/:id", controller.delete);

module.exports = router;