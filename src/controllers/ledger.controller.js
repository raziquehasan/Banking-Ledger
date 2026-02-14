const ledgerModel = require("../models/ledger.model");
const accountModel = require("../models/account.model");

/**
 * GET /api/ledger/:accountId
 * Get all ledger entries for an account (audit trail)
 * Enterprise-grade pagination with metadata
 */
async function getLedgerEntriesController(req, res) {
    try {
        const { accountId } = req.params;
        const { limit = 50, page = 1 } = req.query;
        const user = req.user;

        // Parse pagination params
        const limitNum = parseInt(limit);
        const pageNum = parseInt(page);
        const skip = (pageNum - 1) * limitNum;

        // Verify account belongs to user
        const account = await accountModel.findOne({
            _id: accountId,
            user: user._id
        });

        if (!account) {
            return res.status(404).json({
                message: "Account not found or unauthorized"
            });
        }

        // Get total count for pagination metadata
        const total = await ledgerModel.countDocuments({ account: accountId });

        // Get ledger entries with pagination
        const ledgerEntries = await ledgerModel.find({ account: accountId })
            .populate('transaction', 'fromAccount toAccount amount status createdAt')
            .sort({ createdAt: -1 }) // Most recent first
            .skip(skip)
            .limit(limitNum);

        // Calculate pagination metadata
        const pages = Math.ceil(total / limitNum);

        return res.status(200).json({
            accountId,
            entries: ledgerEntries,
            count: ledgerEntries.length,
            total,
            page: pageNum,
            pages,
            hasMore: pageNum < pages
        });

    } catch (error) {
        console.error('Ledger fetch error:', error);
        return res.status(500).json({
            message: "Failed to fetch ledger entries"
        });
    }
}

module.exports = {
    getLedgerEntriesController
};
