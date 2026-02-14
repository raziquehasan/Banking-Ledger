'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    Send,
    FileText,
    PlusCircle,
    ArrowUpRight,
    ArrowDownRight,
    Wallet
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useAccountStore } from '@/store/account.store';
import { accountAPI, transactionAPI } from '@/lib/api';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

// Mock chart data
const chartData = [
    { month: 'Jan', balance: 45000 },
    { month: 'Feb', balance: 52000 },
    { month: 'Mar', balance: 48000 },
    { month: 'Apr', balance: 61000 },
    { month: 'May', balance: 55000 },
    { month: 'Jun', balance: 67000 },
];

export default function DashboardPage() {
    const user = useAuthStore((state) => state.user);
    const { accounts, setAccounts } = useAccountStore();
    const [totalBalance, setTotalBalance] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch accounts
            const accountsData = await accountAPI.getAccounts();
            setAccounts(accountsData.accounts);

            // Fetch balances
            const balances = await Promise.all(
                accountsData.accounts.map((acc: any) => accountAPI.getBalance(acc._id))
            );
            const total = balances.reduce((sum, bal) => sum + bal.balance, 0);
            setTotalBalance(total);

            // Fetch recent transactions
            try {
                const txData = await transactionAPI.getTransactionHistory({ limit: 5 });
                setRecentTransactions(txData.transactions || []);
            } catch (error) {
                console.log('No transactions yet');
            }
        } catch (error: any) {
            toast.error('Failed to fetch dashboard data');
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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            {/* Balance Header Card */}
            <Card variant="gradient" className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <CardContent className="p-8 relative z-10">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-white/80 text-sm mb-2">Total Balance</p>
                            <h2 className="text-5xl font-bold text-white mb-4">
                                ₹{totalBalance.toLocaleString('en-IN')}
                            </h2>
                            <div className="flex items-center gap-2 text-white/90">
                                <TrendingUp className="h-4 w-4" />
                                <span className="text-sm">+12.5% from last month</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Link href="/transactions">
                                <Button variant="secondary" size="sm">
                                    <Send className="h-4 w-4 mr-2" />
                                    Send Money
                                </Button>
                            </Link>
                            <Link href="/ledger">
                                <Button variant="outline" size="sm">
                                    <FileText className="h-4 w-4 mr-2" />
                                    View Ledger
                                </Button>
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="hover:shadow-lg hover:shadow-indigo-500/10 transition-all">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-400 text-sm">Active Accounts</p>
                                    <p className="text-3xl font-bold text-white mt-2">{accounts.length}</p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                                    <Wallet className="h-6 w-6 text-indigo-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="hover:shadow-lg hover:shadow-emerald-500/10 transition-all">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-400 text-sm">Total Transactions</p>
                                    <p className="text-3xl font-bold text-white mt-2">{recentTransactions.length}</p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                    <ArrowUpRight className="h-6 w-6 text-emerald-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Link href="/accounts">
                        <Card className="hover:shadow-lg hover:shadow-purple-500/10 transition-all cursor-pointer group">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-400 text-sm">Quick Action</p>
                                        <p className="text-xl font-semibold text-white mt-2 group-hover:text-purple-400 transition-colors">
                                            Add Account
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <PlusCircle className="h-6 w-6 text-purple-400" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </motion.div>
            </div>

            {/* Chart Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Balance Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="month" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1e293b',
                                        border: '1px solid #334155',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="balance"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    fill="url(#colorBalance)"
                                    dot={{ fill: '#6366f1', r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Accounts & Transactions Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Accounts */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Your Accounts</CardTitle>
                                <Link href="/accounts">
                                    <Button variant="ghost" size="sm">View All</Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {accounts.length === 0 ? (
                                <p className="text-slate-400 text-center py-8">
                                    No accounts yet. Create one to get started!
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {accounts.slice(0, 3).map((account: any) => (
                                        <div
                                            key={account._id}
                                            className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                                                    <Wallet className="h-5 w-5 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white">{account.currency} Account</p>
                                                    <p className="text-sm text-slate-400">ID: {account._id.slice(-8)}</p>
                                                </div>
                                            </div>
                                            <Badge variant="success">{account.status}</Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Recent Transactions */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Recent Transactions</CardTitle>
                                <Link href="/transactions">
                                    <Button variant="ghost" size="sm">View All</Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {recentTransactions.length === 0 ? (
                                <p className="text-slate-400 text-center py-8">
                                    No transactions yet
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {recentTransactions.map((tx: any) => (
                                        <div
                                            key={tx._id}
                                            className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tx.status === 'COMPLETED' ? 'bg-emerald-500/20' : 'bg-slate-700'
                                                    }`}>
                                                    {tx.status === 'COMPLETED' ? (
                                                        <ArrowUpRight className="h-5 w-5 text-emerald-400" />
                                                    ) : (
                                                        <ArrowDownRight className="h-5 w-5 text-slate-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white">₹{tx.amount.toLocaleString('en-IN')}</p>
                                                    <p className="text-sm text-slate-400">
                                                        {new Date(tx.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge variant={tx.status === 'COMPLETED' ? 'success' : 'default'}>
                                                {tx.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
}
