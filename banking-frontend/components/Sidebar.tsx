'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Wallet,
    ArrowLeftRight,
    FileText,
    User,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Accounts', href: '/accounts', icon: Wallet },
    { name: 'Transactions', href: '/transactions', icon: ArrowLeftRight },
    { name: 'Ledger', href: '/ledger', icon: FileText },
    { name: 'Profile', href: '/profile', icon: User },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{
                x: 0,
                opacity: 1,
                width: isCollapsed ? '80px' : '256px'
            }}
            transition={{ duration: 0.3 }}
            className="relative bg-slate-900 border-r border-slate-800 flex flex-col h-screen"
        >
            {/* Logo */}
            <div className="p-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <Wallet className="h-5 w-5 text-white" />
                    </div>
                    {!isCollapsed && (
                        <div>
                            <h1 className="text-lg font-bold text-white">Banking</h1>
                            <p className="text-xs text-slate-400">Ledger System</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all group relative",
                                isActive
                                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-purple-500/30"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                            )}
                        >
                            <Icon className={cn(
                                "h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110",
                                isActive && "text-white"
                            )} />

                            {!isCollapsed && (
                                <span className="font-medium">{item.name}</span>
                            )}

                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg -z-10"
                                    transition={{ type: "spring", duration: 0.6 }}
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Collapse Toggle */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
                {isCollapsed ? (
                    <ChevronRight className="h-3 w-3" />
                ) : (
                    <ChevronLeft className="h-3 w-3" />
                )}
            </button>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800">
                {!isCollapsed && (
                    <div className="text-xs text-slate-500 text-center">
                        v1.0.0 • Secure Banking
                    </div>
                )}
            </div>
        </motion.div>
    );
}
