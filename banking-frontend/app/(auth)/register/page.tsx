'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Lock, Mail, User, UserPlus } from 'lucide-react';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import type { RegisterFormData } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const setUser = useAuthStore((state) => state.setUser);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true);
        try {
            const response = await authAPI.register(data);
            setUser(response.user);
            toast.success('Registration successful!');
            await new Promise(resolve => setTimeout(resolve, 500));
            router.push('/dashboard');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 px-4 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-500/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md"
            >
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-purple-500/20 p-8"
                >
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mb-4"
                        >
                            <UserPlus className="h-8 w-8 text-white" />
                        </motion.div>

                        <h2 className="text-3xl font-bold text-white mb-2">
                            Create Account
                        </h2>
                        <p className="text-slate-400 text-sm">
                            Join us and start managing your finances
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Input
                                {...register('name')}
                                type="text"
                                label="Full Name"
                                icon={<User className="h-5 w-5" />}
                                error={errors.name?.message}
                                autoComplete="name"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Input
                                {...register('email')}
                                type="email"
                                label="Email address"
                                icon={<Mail className="h-5 w-5" />}
                                error={errors.email?.message}
                                autoComplete="email"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Input
                                {...register('password')}
                                type="password"
                                label="Password"
                                icon={<Lock className="h-5 w-5" />}
                                error={errors.password?.message}
                                autoComplete="new-password"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                loading={isLoading}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creating account...' : 'Sign up'}
                            </Button>
                        </motion.div>

                        <p className="text-center text-sm text-slate-400">
                            Already have an account?{' '}
                            <a href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                                Sign in
                            </a>
                        </p>
                    </form>
                </motion.div>
            </motion.div>
        </div>
    );
}
