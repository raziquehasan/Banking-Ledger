'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { authAPI } from '@/lib/api';
import { toast } from 'sonner';

export default function Sidebar() {
    const router = useRouter();
    const { user, logout } = useAuthStore();

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

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: '📊' },
        { name: 'Accounts', href: '/accounts', icon: '💰' },
        { name: 'Transactions', href: '/transactions', icon: '💸' },
        { name: 'Profile', href: '/profile', icon: '👤' },
    ];

    return (
        <div className="w-64 bg-gray-900 text-white min-h-screen p-6 flex flex-col">
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Banking App</h1>
                <p className="text-sm text-gray-400 mt-1">{user?.name}</p>
            </div>

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                    <a
                        key={item.name}
                        href={item.href}
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span>{item.name}</span>
                    </a>
                ))}
            </nav>

            <button
                onClick={handleLogout}
                className="mt-auto w-full px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
                Logout
            </button>
        </div>
    );
}
