const express=require("express");
const router=express.Router();
const scrapeController=require("../controllers/scrapeController");
router.get("/list", scrapeController.listScrape);
router.post("/add", scrapeController.addScrape);
router.get("/:id", scrapeController.getScrape);
router.post("/edit/:id", scrapeController.updateScrape);
router.get("/delete/:id", scrapeController.deleteScrape);

module.exports=router; 