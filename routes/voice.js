const express = require("express");
const multer = require("multer");
const voiceController = require("../controllers/voiceController");

const router = express.Router();

const upload = multer({
    dest: "uploads/"
});

router.post(
    "/",
    upload.single("audio"),
    voiceController.process
);

module.exports = router;