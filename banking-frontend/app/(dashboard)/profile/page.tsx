'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    User,
    Mail,
    Shield,
    LogOut,
    Wallet,
    ArrowRightLeft,
    Clock,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useAccountStore } from '@/store/account.store';
import { authAPI, accountAPI, transactionAPI } from '@/lib/api';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';

export default function ProfilePage() {
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const { accounts, setAccounts } = useAccountStore();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [stats, setStats] = useState({
        totalAccounts: 0,
        totalTransactions: 0,
        totalBalance: 0,
    });

    useEffect(() => {
        fetchAccountStats();
    }, []);

    const fetchAccountStats = async () => {
        try {
            const accountData = await accountAPI.getAccounts();
            setAccounts(accountData.accounts);

            // Calculate total balance
            let totalBalance = 0;
            for (const acc of accountData.accounts) {
                const balData = await accountAPI.getBalance(acc._id);
                totalBalance += balData.balance;
            }

            // Get transaction count
            const txData = await transactionAPI.getTransactionHistory({ limit: 1000 });

            setStats({
                totalAccounts: accountData.accounts.length,
                totalTransactions: txData.total || 0,
                totalBalance,
            });
        } catch (error) {
            console.log('Failed to fetch stats');
        }
    };

    const handleLogout = async () => {
        try {
            await authAPI.logout();
            logout();
            toast.success('Logged out successfully');
            router.push('/login');
        } catch (error) {
            toast.error('Logout failed');
        }
    };

    // Get user initials for avatar
    const getInitials = (name: string = '') => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const memberSince = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
        : 'Feb 2026';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-4xl"
        >
            {/* Profile Header */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
            >
                <Card variant="glass">
                    <CardContent className="p-8">
                        <div className="flex items-center gap-6">
                            {/* Avatar */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', delay: 0.2 }}
                                className="relative"
                            >
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-purple-500/30">
                                    {getInitials(user?.name)}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-slate-900">
                                    <CheckCircle2 className="h-4 w-4 text-white" />
                                </div>
                            </motion.div>

                            {/* User Info */}
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-white mb-1">{user?.name}</h2>
                                <p className="text-slate-400 mb-2">Premium User</p>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Clock className="h-4 w-4" />
                                    <span>Member since {memberSince}</span>
                                </div>
                            </div>

                            <Badge variant="purple">Verified</Badge>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Account Overview */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <h3 className="text-lg font-semibold text-white mb-4">Account Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="hover:shadow-lg hover:shadow-indigo-500/20 transition-all">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                                    <Wallet className="h-6 w-6 text-indigo-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400">Total Accounts</p>
                                    <p className="text-2xl font-bold text-white">{stats.totalAccounts}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg hover:shadow-purple-500/20 transition-all">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                    <ArrowRightLeft className="h-6 w-6 text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400">Total Transactions</p>
                                    <p className="text-2xl font-bold text-white">{stats.totalTransactions}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg hover:shadow-emerald-500/20 transition-all">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                    <span className="text-xl">₹</span>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400">Total Balance</p>
                                    <p className="text-2xl font-bold text-white">
                                        ₹{stats.totalBalance.toLocaleString('en-IN')}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </motion.div>

            {/* User Details */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                                    <User className="h-4 w-4" />
                                    Full Name
                                </label>
                                <p className="text-lg font-semibold text-white">{user?.name}</p>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                                    <Mail className="h-4 w-4" />
                                    Email Address
                                </label>
                                <p className="text-lg font-semibold text-white">{user?.email}</p>
                            </div>

                            <div className="md:col-span-2">
                                <label className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                                    <Shield className="h-4 w-4" />
                                    User ID
                                </label>
                                <p className="text-lg font-mono text-white bg-slate-800 px-4 py-2 rounded-lg inline-block">
                                    {user?._id}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Security Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-indigo-400" />
                            Security Settings
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                                <div>
                                    <p className="text-sm font-medium text-white">Password Protection</p>
                                    <p className="text-xs text-slate-400">Last updated 2 days ago</p>
                                </div>
                            </div>
                            <Badge variant="success">Active</Badge>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="h-5 w-5 text-amber-400" />
                                <div>
                                    <p className="text-sm font-medium text-white">Two-Factor Authentication</p>
                                    <p className="text-xs text-slate-400">Enhance your account security</p>
                                </div>
                            </div>
                            <Badge variant="warning">Not Enabled</Badge>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Clock className="h-5 w-5 text-indigo-400" />
                                <div>
                                    <p className="text-sm font-medium text-white">Session Expiry</p>
                                    <p className="text-xs text-slate-400">Automatically logs out after inactivity</p>
                                </div>
                            </div>
                            <span className="text-sm text-slate-400">2 days</span>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Danger Zone */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <Card className="border-rose-500/20">
                    <CardHeader>
                        <CardTitle className="text-rose-400">Danger Zone</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white font-medium mb-1">Logout from your account</p>
                                <p className="text-sm text-slate-400">
                                    You'll need to sign in again to access your account
                                </p>
                            </div>
                            <Button
                                variant="danger"
                                onClick={() => setShowLogoutModal(true)}
                                className="ml-4"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Logout Confirmation Modal */}
            <Modal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                title="Confirm Logout"
            >
                <div className="space-y-4">
                    <p className="text-slate-300">
                        Are you sure you want to logout? You'll need to sign in again to access your account.
                    </p>

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setShowLogoutModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            className="flex-1"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </Modal>
        </motion.div>
    );
}
