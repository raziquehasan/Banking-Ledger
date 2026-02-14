'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
    Send,
    ArrowUpRight,
    ArrowDownRight,
    Filter,
    Search
} from 'lucide-react';
import { useAccountStore } from '@/store/account.store';
import { accountAPI, transactionAPI } from '@/lib/api';
import type { TransferFormData, Transaction } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';

const transferSchema = z.object({
    fromAccount: z.string().min(1, 'From account is required'),
    toAccount: z.string().min(1, 'To account is required'),
    amount: z.number().min(1, 'Amount must be greater than 0'),
});

export default function TransactionsPage() {
    const { accounts, setAccounts } = useAccountStore();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingTransfer, setPendingTransfer] = useState<TransferFormData | null>(null);
    const [fromBalance, setFromBalance] = useState<number>(0);
    const [statusFilter, setStatusFilter] = useState<string>('');

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm<TransferFormData>({
        resolver: zodResolver(transferSchema),
    });

    const watchedFromAccount = watch('fromAccount');
    const watchedAmount = watch('amount');

    useEffect(() => {
        fetchAccounts();
        fetchTransactions();
    }, []);

    useEffect(() => {
        if (watchedFromAccount) {
            fetchBalance(watchedFromAccount);
        }
    }, [watchedFromAccount]);

    const fetchAccounts = async () => {
        try {
            const data = await accountAPI.getAccounts();
            setAccounts(data.accounts);
        } catch (error) {
            toast.error('Failed to fetch accounts');
        }
    };

    const fetchBalance = async (accountId: string) => {
        try {
            const data = await accountAPI.getBalance(accountId);
            setFromBalance(data.balance);
        } catch (error) {
            setFromBalance(0);
        }
    };

    const fetchTransactions = async () => {
        try {
            const data = await transactionAPI.getTransactionHistory({
                limit: 20,
                status: statusFilter || undefined
            });
            setTransactions(data.transactions || []);
        } catch (error) {
            console.log('No transactions yet');
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [statusFilter]);

    const onSubmit = async (data: TransferFormData) => {
        setPendingTransfer(data);
        setShowConfirmModal(true);
    };

    const confirmTransfer = async () => {
        if (!pendingTransfer) return;

        setIsLoading(true);
        setShowConfirmModal(false);

        try {
            const idempotencyKey = uuidv4();
            await transactionAPI.createTransaction({
                ...pendingTransfer,
                idempotencyKey,
            });

            // Success confetti
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });

            toast.success('Transaction completed successfully!');
            reset();
            setPendingTransfer(null);
            fetchAccounts();
            fetchTransactions();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Transaction failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div>
                <h1 className="text-3xl font-bold text-white">Transactions</h1>
                <p className="text-slate-400 mt-1">Transfer money and view transaction history</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Transfer Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Transfer Money</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    From Account
                                </label>
                                <select
                                    {...register('fromAccount')}
                                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">Select account</option>
                                    {accounts.map((acc: any) => (
                                        <option key={acc._id} value={acc._id}>
                                            {acc.currency} - {acc._id.slice(-8)}
                                        </option>
                                    ))}
                                </select>
                                {errors.fromAccount && (
                                    <p className="mt-1 text-sm text-rose-400">{errors.fromAccount.message}</p>
                                )}
                            </div>

                            {/* Live Balance Preview */}
                            {watchedFromAccount && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-400">Available Balance</span>
                                        <span className="text-lg font-semibold text-white">
                                            ₹{fromBalance.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                    {watchedAmount && watchedAmount > fromBalance && (
                                        <p className="text-sm text-rose-400 mt-2">Insufficient balance</p>
                                    )}
                                </motion.div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    To Account ID
                                </label>
                                <input
                                    {...register('toAccount')}
                                    type="text"
                                    placeholder="Enter recipient account ID"
                                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                {errors.toAccount && (
                                    <p className="mt-1 text-sm text-rose-400">{errors.toAccount.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Amount (₹)
                                </label>
                                <input
                                    {...register('amount', { valueAsNumber: true })}
                                    type="number"
                                    placeholder="0.00"
                                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                {errors.amount && (
                                    <p className="mt-1 text-sm text-rose-400">{errors.amount.message}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                disabled={isLoading || (watchedAmount > fromBalance)}
                            >
                                <Send className="h-4 w-4 mr-2" />
                                {isLoading ? 'Processing...' : 'Transfer Money'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Transaction Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Transaction Info</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                                    <span className="text-indigo-400">⚡</span>
                                </div>
                                <div>
                                    <h4 className="font-medium text-white">Instant Processing</h4>
                                    <p className="text-sm text-slate-400">Transactions are processed immediately</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                    <span className="text-emerald-400">🔒</span>
                                </div>
                                <div>
                                    <h4 className="font-medium text-white">ACID Compliant</h4>
                                    <p className="text-sm text-slate-400">All transactions are atomic and consistent</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                    <span className="text-purple-400">📧</span>
                                </div>
                                <div>
                                    <h4 className="font-medium text-white">Email Notifications</h4>
                                    <p className="text-sm text-slate-400">Get notified for every transaction</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Transaction History */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Transaction History</CardTitle>
                        <div className="flex items-center gap-2">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">All Status</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="PENDING">Pending</option>
                                <option value="FAILED">Failed</option>
                            </select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {transactions.length === 0 ? (
                        <p className="text-slate-400 text-center py-12">No transactions yet</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b border-slate-800">
                                    <tr>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Date</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">From</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">To</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">Amount</th>
                                        <th className="text-center py-3 px-4 text-sm font-semibold text-slate-400">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((tx: any, index) => (
                                        <motion.tr
                                            key={tx._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                                        >
                                            <td className="py-4 px-4 text-sm text-slate-300">
                                                {new Date(tx.createdAt).toLocaleDateString('en-IN', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </td>
                                            <td className="py-4 px-4 text-sm text-slate-400 font-mono">
                                                {tx.fromAccount?._id?.slice(-8) || tx.fromAccount?.slice(-8)}
                                            </td>
                                            <td className="py-4 px-4 text-sm text-slate-400 font-mono">
                                                {tx.toAccount?._id?.slice(-8) || tx.toAccount?.slice(-8)}
                                            </td>
                                            <td className="py-4 px-4 text-right font-semibold text-white">
                                                ₹{tx.amount.toLocaleString('en-IN')}
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <Badge variant={
                                                    tx.status === 'COMPLETED' ? 'success' :
                                                        tx.status === 'PENDING' ? 'warning' :
                                                            'danger'
                                                }>
                                                    {tx.status}
                                                </Badge>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Confirmation Modal */}
            <Modal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                title="Confirm Transfer"
            >
                {pendingTransfer && (
                    <div className="space-y-4">
                        <p className="text-slate-300">Please review the transfer details:</p>

                        <div className="p-4 bg-slate-800/50 rounded-lg space-y-3">
                            <div className="flex justify-between">
                                <span className="text-slate-400">From Account:</span>
                                <span className="text-white font-mono">{pendingTransfer.fromAccount.slice(-8)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">To Account:</span>
                                <span className="text-white font-mono">{pendingTransfer.toAccount.slice(-8)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Amount:</span>
                                <span className="text-2xl font-bold text-white">
                                    ₹{pendingTransfer.amount.toLocaleString('en-IN')}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => setShowConfirmModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="flex-1"
                                onClick={confirmTransfer}
                                loading={isLoading}
                            >
                                Confirm Transfer
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </motion.div>
    );
}
