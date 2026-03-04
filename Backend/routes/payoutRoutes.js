const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const payoutController = require("../controllers/payoutController");

router.get("/", auth, payoutController.getPayouts);

router.post("/", auth, role("OPS"), payoutController.createPayout);

router.get("/:id", auth, payoutController.getPayoutById);

router.post("/:id/submit", auth, role("OPS"), payoutController.submitPayout);

router.post("/:id/approve", auth, role("FINANCE"), payoutController.approvePayout);

router.post("/:id/reject", auth, role("FINANCE"), payoutController.rejectPayout);

module.exports = router;