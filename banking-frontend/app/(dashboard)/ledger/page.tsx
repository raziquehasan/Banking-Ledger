'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Download,
    ChevronDown,
    ChevronUp,
    TrendingUp,
    TrendingDown,
    Calendar,
    Filter,
    ArrowUpDown,
    Send
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAccountStore } from '@/store/account.store';
import { accountAPI, transactionAPI } from '@/lib/api';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function LedgerPage() {
    const router = useRouter();
    const { accounts, setAccounts } = useAccountStore();
    const [selectedAccount, setSelectedAccount] = useState<string>('');
    const [ledgerEntries, setLedgerEntries] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [currentBalance, setCurrentBalance] = useState<number>(0);

    // Filters
    const [typeFilter, setTypeFilter] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

    // Summary calculations
    const [summary, setSummary] = useState({
        totalCredits: 0,
        totalDebits: 0,
        netChange: 0,
    });

    useEffect(() => {
        fetchAccounts();
    }, []);

    useEffect(() => {
        if (selectedAccount) {
            fetchLedgerEntries();
            fetchBalance();
        }
    }, [selectedAccount, typeFilter, sortOrder]);

    const fetchAccounts = async () => {
        try {
            const data = await accountAPI.getAccounts();
            setAccounts(data.accounts);
            if (data.accounts.length > 0) {
                setSelectedAccount(data.accounts[0]._id);
            }
        } catch (error) {
            toast.error('Failed to fetch accounts');
        }
    };

    const fetchBalance = async () => {
        try {
            const data = await accountAPI.getBalance(selectedAccount);
            setCurrentBalance(data.balance);
        } catch (error) {
            setCurrentBalance(0);
        }
    };

    const fetchLedgerEntries = async () => {
        setIsLoading(true);
        try {
            const data = await transactionAPI.getLedgerEntries(selectedAccount);
            let entries = data.entries || [];

            // Apply type filter
            if (typeFilter) {
                entries = entries.filter((e: any) => e.type === typeFilter);
            }

            // Apply sort
            entries.sort((a: any, b: any) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
            });

            // Calculate running balance
            let runningBalance = currentBalance;
            const entriesWithBalance = entries.map((entry: any, index: number) => {
                if (sortOrder === 'newest') {
                    // For newest first, subtract previous transactions
                    const balanceAfter = runningBalance;
                    runningBalance = entry.type === 'CREDIT'
                        ? runningBalance - entry.amount
                        : runningBalance + entry.amount;
                    return { ...entry, balanceAfter };
                } else {
                    // For oldest first, add as we go
                    runningBalance = entry.type === 'CREDIT'
                        ? runningBalance + entry.amount
                        : runningBalance - entry.amount;
                    return { ...entry, balanceAfter: runningBalance };
                }
            });

            setLedgerEntries(entriesWithBalance);

            // Calculate summary
            const credits = entries
                .filter((e: any) => e.type === 'CREDIT')
                .reduce((sum: number, e: any) => sum + e.amount, 0);
            const debits = entries
                .filter((e: any) => e.type === 'DEBIT')
                .reduce((sum: number, e: any) => sum + e.amount, 0);

            setSummary({
                totalCredits: credits,
                totalDebits: debits,
                netChange: credits - debits,
            });
        } catch (error) {
            toast.error('Failed to fetch ledger entries');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleRow = (id: string) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedRows(newExpanded);
    };

    const selectedAccountData = accounts.find((acc: any) => acc._id === selectedAccount);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Account Ledger</h1>
                    <p className="text-slate-400 mt-1">Complete transaction audit trail</p>
                </div>
                <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                </Button>
            </div>

            {/* Account Selector */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                        <FileText className="h-5 w-5 text-indigo-400" />
                        <div className="flex-1">
                            <label className="text-sm text-slate-400 mb-2 block">Select Account</label>
                            <select
                                value={selectedAccount}
                                onChange={(e) => setSelectedAccount(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                {accounts.map((account: any) => (
                                    <option key={account._id} value={account._id}>
                                        {account.currency} Account - {account._id.slice(-8)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Summary Card */}
            {selectedAccount && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card variant="gradient" className="relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <CardContent className="p-6 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                                <div>
                                    <p className="text-sm text-white/70 mb-1">Account</p>
                                    <p className="text-lg font-bold text-white">
                                        {selectedAccountData?.currency} - {selectedAccount.slice(-8)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-white/70 mb-1">Current Balance</p>
                                    <p className="text-2xl font-bold text-white">
                                        ₹{currentBalance.toLocaleString('en-IN')}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-white/70 mb-1 flex items-center gap-1">
                                        <TrendingUp className="h-3 w-3" />
                                        Total Credits
                                    </p>
                                    <p className="text-xl font-bold text-emerald-300">
                                        +₹{summary.totalCredits.toLocaleString('en-IN')}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-white/70 mb-1 flex items-center gap-1">
                                        <TrendingDown className="h-3 w-3" />
                                        Total Debits
                                    </p>
                                    <p className="text-xl font-bold text-rose-300">
                                        -₹{summary.totalDebits.toLocaleString('en-IN')}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-white/70 mb-1">Net Change</p>
                                    <p className={`text-xl font-bold ${summary.netChange >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                                        {summary.netChange >= 0 ? '+' : ''}₹{summary.netChange.toLocaleString('en-IN')}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Filters Section */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-slate-400" />
                            <span className="text-sm text-slate-400">Filters:</span>
                        </div>

                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All Types</option>
                            <option value="CREDIT">Credit Only</option>
                            <option value="DEBIT">Debit Only</option>
                        </select>

                        <button
                            onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
                            className="flex items-center gap-2 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white hover:bg-slate-700 transition-colors"
                        >
                            <ArrowUpDown className="h-4 w-4" />
                            {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
                        </button>
                    </div>
                </CardContent>
            </Card>

            {/* Ledger Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : ledgerEntries.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-16"
                        >
                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText className="h-8 w-8 text-slate-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">No Transactions Yet</h3>
                            <p className="text-slate-400 mb-6 max-w-md mx-auto">
                                Once you transfer funds, they will appear here with complete audit trail.
                            </p>
                            <Button onClick={() => router.push('/transactions')}>
                                <Send className="h-4 w-4 mr-2" />
                                Make Your First Transaction
                            </Button>
                        </motion.div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="sticky top-0 bg-slate-900 border-b border-slate-800">
                                    <tr>
                                        <th className="text-left py-4 px-4 text-sm font-semibold text-slate-400">Date</th>
                                        <th className="text-left py-4 px-4 text-sm font-semibold text-slate-400">Type</th>
                                        <th className="text-right py-4 px-4 text-sm font-semibold text-slate-400">Amount</th>
                                        <th className="text-right py-4 px-4 text-sm font-semibold text-slate-400">Balance After</th>
                                        <th className="text-left py-4 px-4 text-sm font-semibold text-slate-400">Transaction ID</th>
                                        <th className="text-center py-4 px-4 text-sm font-semibold text-slate-400">Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AnimatePresence>
                                        {ledgerEntries.map((entry: any, index) => (
                                            <motion.tr
                                                key={entry._id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors group"
                                            >
                                                <td className="py-4 px-4 text-sm text-slate-300">
                                                    {new Date(entry.createdAt).toLocaleDateString('en-IN', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <Badge variant={entry.type === 'CREDIT' ? 'success' : 'danger'}>
                                                        {entry.type}
                                                    </Badge>
                                                </td>
                                                <td className={`py-4 px-4 text-right font-semibold ${entry.type === 'CREDIT' ? 'text-emerald-400' : 'text-rose-400'
                                                    }`}>
                                                    {entry.type === 'CREDIT' ? '+' : '-'}₹{entry.amount.toLocaleString('en-IN')}
                                                </td>
                                                <td className="py-4 px-4 text-right font-bold text-white">
                                                    ₹{entry.balanceAfter.toLocaleString('en-IN')}
                                                </td>
                                                <td className="py-4 px-4 text-sm text-slate-400 font-mono">
                                                    {entry.transaction?._id?.slice(-8) || 'N/A'}
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    <button
                                                        onClick={() => toggleRow(entry._id)}
                                                        className="text-indigo-400 hover:text-indigo-300 transition-colors"
                                                    >
                                                        {expandedRows.has(entry._id) ? (
                                                            <ChevronUp className="h-4 w-4" />
                                                        ) : (
                                                            <ChevronDown className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
