'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useAccountStore } from '@/store/account.store';
import { accountAPI } from '@/lib/api';
import { toast } from 'sonner';

export default function DashboardPage() {
    const user = useAuthStore((state) => state.user);
    const { accounts, setAccounts } = useAccountStore();
    const [totalBalance, setTotalBalance] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const data = await accountAPI.getAccounts();
            setAccounts(data.accounts);

            // Fetch balances for all accounts
            const balances = await Promise.all(
                data.accounts.map((acc) => accountAPI.getBalance(acc._id))
            );

            const total = balances.reduce((sum, bal) => sum + bal.balance, 0);
            setTotalBalance(total);
        } catch (error: any) {
            toast.error('Failed to fetch accounts');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Welcome back, {user?.name}!
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Here's your financial overview
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Balance</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                        ₹{totalBalance.toLocaleString()}
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Accounts</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                        {accounts.length}
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Account Status</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">Active</p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Your Accounts
                </h2>

                {accounts.length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-400">
                        No accounts yet. Create one to get started!
                    </p>
                ) : (
                    <div className="space-y-4">
                        {accounts.map((account) => (
                            <div
                                key={account._id}
                                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                            >
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {account.currency} Account
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {account._id}
                                    </p>
                                </div>
                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                    {account.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
