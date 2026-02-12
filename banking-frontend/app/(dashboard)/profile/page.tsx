'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { authAPI } from '@/lib/api';
import { toast } from 'sonner';

export default function ProfilePage() {
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

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-2xl">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                            Name
                        </label>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {user?.name}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                            Email
                        </label>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {user?.email}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                            User ID
                        </label>
                        <p className="text-lg font-mono text-gray-900 dark:text-white">
                            {user?._id}
                        </p>
                    </div>

                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={handleLogout}
                            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
