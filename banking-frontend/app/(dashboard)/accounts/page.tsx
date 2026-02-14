'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Wallet, Plus, TrendingUp } from 'lucide-react';
import { useAccountStore } from '@/store/account.store';
import { accountAPI } from '@/lib/api';
import type { CreateAccountFormData } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';

const createAccountSchema = z.object({
    currency: z.string().min(1, 'Currency is required'),
});

const currencies = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD'];

export default function AccountsPage() {
    const { accounts, setAccounts } = useAccountStore();
    const [isLoading, setIsLoading] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [balances, setBalances] = useState<Record<string, number>>({});

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CreateAccountFormData>({
        resolver: zodResolver(createAccountSchema),
    });

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const data = await accountAPI.getAccounts();
            setAccounts(data.accounts);

            // Fetch balances for all accounts
            const balancePromises = data.accounts.map((acc: any) =>
                accountAPI.getBalance(acc._id).then(bal => ({ id: acc._id, balance: bal.balance }))
            );
            const balanceResults = await Promise.all(balancePromises);
            const balanceMap: Record<string, number> = {};
            balanceResults.forEach(({ id, balance }) => {
                balanceMap[id] = balance;
            });
            setBalances(balanceMap);
        } catch (error) {
            toast.error('Failed to fetch accounts');
        }
    };

    const onSubmit = async (data: CreateAccountFormData) => {
        setIsLoading(true);
        try {
            await accountAPI.createAccount(data);
            toast.success('Account created successfully!');
            reset();
            setShowCreateModal(false);
            fetchAccounts();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create account');
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Accounts</h1>
                    <p className="text-slate-400 mt-1">Manage your banking accounts</p>
                </div>
                <Button onClick={() => setShowCreateModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Account
                </Button>
            </div>

            {/* Account Cards Grid */}
            {accounts.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <Wallet className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400 mb-4">No accounts yet. Create one to get started!</p>
                        <Button onClick={() => setShowCreateModal(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Your First Account
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {accounts.map((account: any, index) => (
                        <motion.div
                            key={account._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card
                                variant="glass"
                                className="hover:shadow-lg hover:shadow-indigo-500/20 transition-all cursor-pointer group"
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Wallet className="h-6 w-6 text-white" />
                                        </div>
                                        <Badge variant="success">{account.status}</Badge>
                                    </div>

                                    <div className="space-y-2">
                                        <div>
                                            <p className="text-sm text-slate-400">Currency</p>
                                            <p className="text-2xl font-bold text-white">{account.currency}</p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-slate-400">Balance</p>
                                            <p className="text-3xl font-bold text-white">
                                                {account.currency === 'INR' ? '₹' : '$'}
                                                {(balances[account._id] || 0).toLocaleString('en-IN')}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-slate-400">Account ID</p>
                                            <p className="text-sm font-mono text-slate-300">
                                                {account._id.slice(-12)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-slate-700">
                                        <div className="flex items-center gap-2 text-sm text-emerald-400">
                                            <TrendingUp className="h-4 w-4" />
                                            <span>Active</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Create Account Modal */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Create New Account"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Select Currency
                        </label>
                        <select
                            {...register('currency')}
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Choose currency</option>
                            {currencies.map((curr) => (
                                <option key={curr} value={curr}>
                                    {curr}
                                </option>
                            ))}
                        </select>
                        {errors.currency && (
                            <p className="mt-1 text-sm text-rose-400">{errors.currency.message}</p>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => setShowCreateModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                            loading={isLoading}
                        >
                            Create Account
                        </Button>
                    </div>
                </form>
            </Modal>
        </motion.div>
    );
}
