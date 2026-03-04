const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
 getVendors,
 createVendor
} = require("../controllers/vendorController");


router.get("/",authMiddleware,getVendors);

router.post("/",authMiddleware,createVendor);


module.exports = router;