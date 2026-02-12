'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAccountStore } from '@/store/account.store';
import { accountAPI } from '@/lib/api';
import type { CreateAccountFormData } from '@/types';

const accountSchema = z.object({
    currency: z.string().min(1, 'Currency is required'),
});

export default function AccountsPage() {
    const { accounts, setAccounts, addAccount } = useAccountStore();
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [balances, setBalances] = useState<Record<string, number>>({});

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CreateAccountFormData>({
        resolver: zodResolver(accountSchema),
    });

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const data = await accountAPI.getAccounts();
            setAccounts(data.accounts);

            // Fetch balances
            const balanceData: Record<string, number> = {};
            for (const acc of data.accounts) {
                const bal = await accountAPI.getBalance(acc._id);
                balanceData[acc._id] = bal.balance;
            }
            setBalances(balanceData);
        } catch (error) {
            toast.error('Failed to fetch accounts');
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data: CreateAccountFormData) => {
        try {
            const response = await accountAPI.createAccount(data);
            addAccount(response.account);
            toast.success('Account created successfully!');
            setShowModal(false);
            reset();
            fetchAccounts();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create account');
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
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Accounts</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    + Create Account
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accounts.map((account) => (
                    <div
                        key={account._id}
                        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Account</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {account.currency}
                                </p>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                {account.status}
                            </span>
                        </div>

                        <div className="mb-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Balance</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                ₹{(balances[account._id] || 0).toLocaleString()}
                            </p>
                        </div>

                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            ID: {account._id.slice(-8)}
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Account Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl max-w-md w-full">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Create New Account
                        </h2>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Currency
                                </label>
                                <select
                                    {...register('currency')}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="">Select currency</option>
                                    <option value="INR">INR - Indian Rupee</option>
                                    <option value="USD">USD - US Dollar</option>
                                    <option value="EUR">EUR - Euro</option>
                                </select>
                                {errors.currency && (
                                    <p className="mt-1 text-sm text-red-600">{errors.currency.message}</p>
                                )}
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
