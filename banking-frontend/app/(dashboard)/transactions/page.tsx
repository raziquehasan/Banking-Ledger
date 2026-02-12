'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { useAccountStore } from '@/store/account.store';
import { accountAPI, transactionAPI } from '@/lib/api';
import type { TransferFormData, Transaction } from '@/types';

const transferSchema = z.object({
    fromAccount: z.string().min(1, 'From account is required'),
    toAccount: z.string().min(1, 'To account is required'),
    amount: z.number().min(1, 'Amount must be greater than 0'),
});

export default function TransactionsPage() {
    const { accounts, setAccounts } = useAccountStore();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<TransferFormData>({
        resolver: zodResolver(transferSchema),
    });

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const data = await accountAPI.getAccounts();
            setAccounts(data.accounts);
        } catch (error) {
            toast.error('Failed to fetch accounts');
        }
    };

    const onSubmit = async (data: TransferFormData) => {
        setIsLoading(true);
        try {
            const idempotencyKey = uuidv4();
            const response = await transactionAPI.createTransaction({
                ...data,
                idempotencyKey,
            });

            toast.success('Transaction completed successfully!');
            reset();
            // Refresh accounts to update balances
            fetchAccounts();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Transaction failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transactions</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Transfer Form */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                        Transfer Money
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                From Account
                            </label>
                            <select
                                {...register('fromAccount')}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">Select account</option>
                                {accounts.map((acc) => (
                                    <option key={acc._id} value={acc._id}>
                                        {acc.currency} - {acc._id.slice(-8)}
                                    </option>
                                ))}
                            </select>
                            {errors.fromAccount && (
                                <p className="mt-1 text-sm text-red-600">{errors.fromAccount.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                To Account
                            </label>
                            <input
                                {...register('toAccount')}
                                type="text"
                                placeholder="Enter account ID"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                            />
                            {errors.toAccount && (
                                <p className="mt-1 text-sm text-red-600">{errors.toAccount.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Amount
                            </label>
                            <input
                                {...register('amount', { valueAsNumber: true })}
                                type="number"
                                placeholder="0.00"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                            />
                            {errors.amount && (
                                <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? 'Processing...' : 'Transfer'}
                        </button>
                    </form>
                </div>

                {/* Transaction Info */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                        Transaction Info
                    </h2>
                    <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                        <p>• Transactions are processed immediately</p>
                        <p>• All transactions are ACID compliant</p>
                        <p>• Email notifications are sent for each transaction</p>
                        <p>• Idempotency keys prevent duplicate transactions</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
