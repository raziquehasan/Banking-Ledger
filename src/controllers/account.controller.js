const accountModel = require("../models/account.model");


async function createAccountController(req, res) {
    try {
        const user = req.user;
        const { currency } = req.body;

        // Validate currency
        const validCurrencies = ['INR', 'USD', 'EUR'];
        if (currency && !validCurrencies.includes(currency)) {
            return res.status(400).json({
                message: "Invalid currency. Must be INR, USD, or EUR"
            });
        }

        const account = await accountModel.create({
            user: user._id,
            currency: currency || 'INR'  // Use provided currency or default to INR
        });

        return res.status(201).json({ account });

    } catch (error) {
        console.error('Account creation error:', error);
        return res.status(500).json({
            message: "Failed to create account"
        });
    }
}

async function getUserAccountsController(req, res) {

    const accounts = await accountModel.find({ user: req.user._id });

    res.status(200).json({
        accounts
    })
}

async function getAccountBalanceController(req, res) {
    const { accountId } = req.params;

    const account = await accountModel.findOne({
        _id: accountId,
        user: req.user._id
    })

    if (!account) {
        return res.status(404).json({
            message: "Account not found"
        })
    }

    const balance = await account.getBalance();

    res.status(200).json({
        accountId: account._id,
        balance: balance
    })
}


module.exports = {
    createAccountController,
    getUserAccountsController,
    getAccountBalanceController
}