const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");

router.get("/list", categoryController.listCategory);
router.get("/check-name", categoryController.checkCategoryName);
router.get("/find-by-name", categoryController.findCategoryByName);
router.post("/add", categoryController.addCategory);
router.get("/:id", categoryController.getCategory);
router.get("/edit/:id", categoryController.editCategory);
router.post("/edit/:id", categoryController.updateCategory);
router.get("/delete/:id", categoryController.deleteCategory);

module.exports = router;
