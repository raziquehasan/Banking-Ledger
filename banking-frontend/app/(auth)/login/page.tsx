'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Lock, Mail, Shield, CheckCircle2 } from 'lucide-react';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import type { LoginFormData } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const setUser = useAuthStore((state) => state.setUser);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        setHasError(false);
        try {
            const response = await authAPI.login(data);
            setUser(response.user);
            toast.success('Login successful!');

            // Success animation before redirect
            await new Promise(resolve => setTimeout(resolve, 500));
            router.push('/dashboard');
        } catch (error: any) {
            setHasError(true);
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 px-4 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-500/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
            </div>

            {/* Login Card */}
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
                    {/* Logo/Brand */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mb-4"
                        >
                            <Lock className="h-8 w-8 text-white" />
                        </motion.div>

                        <h2 className="text-3xl font-bold text-white mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-slate-400 text-sm">
                            Securely access your financial dashboard
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
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
                            transition={{ delay: 0.4 }}
                            className={hasError ? 'animate-shake' : ''}
                        >
                            <Input
                                {...register('password')}
                                type="password"
                                label="Password"
                                icon={<Lock className="h-5 w-5" />}
                                error={errors.password?.message}
                                autoComplete="current-password"
                            />
                        </motion.div>

                        {/* Remember me & Forgot password */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center text-slate-400 cursor-pointer hover:text-white transition-colors">
                                <input type="checkbox" className="mr-2 rounded border-slate-700 bg-slate-800" />
                                Remember me
                            </label>
                            <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                                Forgot password?
                            </a>
                        </div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                loading={isLoading}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Signing in...' : 'Sign in'}
                            </Button>
                        </motion.div>

                        {/* Sign up link */}
                        <p className="text-center text-sm text-slate-400">
                            Don't have an account?{' '}
                            <a href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                                Sign up
                            </a>
                        </p>
                    </form>

                    {/* Security Badge */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-8 pt-6 border-t border-slate-800"
                    >
                        <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                            <Shield className="h-4 w-4" />
                            <span>Protected by JWT Encryption</span>
                        </div>
                        <div className="flex items-center justify-center gap-4 mt-3 text-xs text-slate-600">
                            <div className="flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                <span>256-bit SSL</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                <span>Secure Auth</span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
}
