const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const ledgerController = require("../controllers/ledger.controller");

const router = express.Router();

/**
 * GET /api/ledger/:accountId
 * Get all ledger entries for an account (audit trail)
 * Protected Route
 */
router.get("/:accountId", authMiddleware.authMiddleware, ledgerController.getLedgerEntriesController);

module.exports = router;
