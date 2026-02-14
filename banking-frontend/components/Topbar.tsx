'use client';

import { Bell, LogOut, Moon, Sun, User } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';
import { toast } from 'sonner';

export default function Topbar() {
    const user = useAuthStore((state) => state.user);
    const clearUser = useAuthStore((state) => state.clearUser);
    const router = useRouter();
    const [isDark, setIsDark] = useState(true);

    const handleLogout = async () => {
        try {
            await authAPI.logout();
            clearUser();
            toast.success('Logged out successfully');
            router.push('/login');
        } catch (error) {
            toast.error('Logout failed');
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <div className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
            <div className="flex items-center justify-between px-6 py-4">
                {/* Left: Greeting */}
                <div>
                    <h2 className="text-lg font-semibold text-white">
                        {getGreeting()}, {user?.name || 'User'}
                    </h2>
                    <p className="text-sm text-slate-400">
                        Welcome to your financial dashboard
                    </p>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                    {/* Theme Toggle */}
                    <button
                        onClick={() => setIsDark(!isDark)}
                        className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
                    >
                        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </button>

                    {/* Notifications */}
                    <button className="relative p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full" />
                    </button>

                    {/* User Avatar */}
                    <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="text-sm">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
