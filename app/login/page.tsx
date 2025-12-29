'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mail, Lock, User, Phone, AlertCircle, Loader, Eye, EyeOff, Plane } from 'lucide-react';

type AuthMode = 'login' | 'register';
type UserRole = 'client' | 'admin';

export default function LoginPage() {
    const router = useRouter();
    const [mode, setMode] = useState<AuthMode>('login');
    const [role, setRole] = useState<UserRole>('client');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Login failed');
                setLoading(false);
                return;
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            if (data.user.role === 'admin') {
                router.push('/admin/dashboard');
            } else {
                router.push('/');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (registerData.password !== registerData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: registerData.name,
                    email: registerData.email,
                    password: registerData.password,
                    phone: registerData.phone,
                    role,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Registration failed');
                setLoading(false);
                return;
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            if (role === 'admin') {
                router.push('/admin/dashboard');
            } else {
                router.push('/');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center px-4 py-8 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#DAA520]/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-br from-[#DAA520] to-[#c99416] rounded-lg">
                            <Plane className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#DAA520] via-yellow-400 to-[#DAA520] bg-clip-text text-transparent">ASR</h1>
                            <p className="text-gray-400 text-sm tracking-widest uppercase">Aviation</p>
                        </div>
                    </div>
                    <p className="text-gray-400 text-sm">Premium Aviation Services Portal</p>
                </div>

                {/* Main Card */}
                <Card className="bg-gray-800/60 border border-gray-700/50 backdrop-blur-2xl shadow-2xl">
                    <div className="p-8">
                        {/* Mode Toggle */}
                        <div className="flex gap-3 mb-8">
                            <button
                                onClick={() => { setMode('login'); setError(''); }}
                                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${mode === 'login'
                                    ? 'bg-gradient-to-r from-[#DAA520] to-[#c99416] text-white shadow-lg shadow-[#DAA520]/30'
                                    : 'bg-gray-700/40 text-gray-300 hover:bg-gray-700/60 border border-gray-600/30'
                                    }`}
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => { setMode('register'); setError(''); }}
                                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${mode === 'register'
                                    ? 'bg-gradient-to-r from-[#DAA520] to-[#c99416] text-white shadow-lg shadow-[#DAA520]/30'
                                    : 'bg-gray-700/40 text-gray-300 hover:bg-gray-700/60 border border-gray-600/30'
                                    }`}
                            >
                                Sign Up
                            </button>
                        </div>

                        {/* Role Selection */}
                        {mode === 'register' && (
                            <div className="mb-6 p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                                <label className="block text-xs font-semibold text-gray-300 mb-3 uppercase tracking-wider">
                                    Select Your Role
                                </label>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setRole('client')}
                                        className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition-all duration-300 ${role === 'client'
                                            ? 'bg-gradient-to-r from-[#DAA520] to-[#c99416] text-white shadow-lg'
                                            : 'bg-gray-700/50 border border-gray-600 text-gray-300 hover:border-[#DAA520]/50'
                                            }`}
                                    >
                                        👤 Traveler
                                    </button>
                                    <button
                                        onClick={() => setRole('admin')}
                                        className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition-all duration-300 ${role === 'admin'
                                            ? 'bg-gradient-to-r from-[#DAA520] to-[#c99416] text-white shadow-lg'
                                            : 'bg-gray-700/50 border border-gray-600 text-gray-300 hover:border-[#DAA520]/50'
                                            }`}
                                    >
                                        🔐 Administrator
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 flex items-center gap-3 bg-red-500/15 border border-red-500/50 rounded-lg p-4 backdrop-blur-sm">
                                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                                <span className="text-sm text-red-300">{error}</span>
                            </div>
                        )}

                        {/* Login Form */}
                        {mode === 'login' && (
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#DAA520] group-focus-within:text-yellow-400 transition-colors" />
                                        <input
                                            type="email"
                                            autoComplete="email"
                                            value={loginData.email}
                                            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                            placeholder="admin@gmail.com"
                                            className="w-full bg-gray-700/40 border border-gray-600/50 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#DAA520] focus:ring-2 focus:ring-[#DAA520]/30 transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        Password
                                    </label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#DAA520] group-focus-within:text-yellow-400 transition-colors" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            autoComplete="current-password"
                                            value={loginData.password}
                                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                            placeholder="••••••••"
                                            className="w-full bg-gray-700/40 border border-gray-600/50 rounded-lg pl-12 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#DAA520] focus:ring-2 focus:ring-[#DAA520]/30 transition-all"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#DAA520] transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-[#DAA520] to-[#c99416] hover:from-[#c99416] hover:to-[#b8820f] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 mt-6 shadow-lg shadow-[#DAA520]/20 transition-all"
                                >
                                    {loading ? (
                                        <>
                                            <Loader className="w-5 h-5 animate-spin" />
                                            Signing In...
                                        </>
                                    ) : (
                                        <>Sign In to Your Account</>
                                    )}
                                </Button>
                            </form>
                        )}

                        {/* Register Form */}
                        {mode === 'register' && (
                            <form onSubmit={handleRegister} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        Full Name
                                    </label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#DAA520] group-focus-within:text-yellow-400 transition-colors" />
                                        <input
                                            type="text"
                                            value={registerData.name}
                                            onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                                            placeholder="Your full name"
                                            className="w-full bg-gray-700/40 border border-gray-600/50 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#DAA520] focus:ring-2 focus:ring-[#DAA520]/30 transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#DAA520] group-focus-within:text-yellow-400 transition-colors" />
                                        <input
                                            type="email"
                                            autoComplete="email"
                                            value={registerData.email}
                                            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                            placeholder="your@email.com"
                                            className="w-full bg-gray-700/40 border border-gray-600/50 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#DAA520] focus:ring-2 focus:ring-[#DAA520]/30 transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        Phone Number
                                    </label>
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#DAA520] group-focus-within:text-yellow-400 transition-colors" />
                                        <input
                                            type="tel"
                                            value={registerData.phone}
                                            onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                                            placeholder="+1 (555) 000-0000"
                                            className="w-full bg-gray-700/40 border border-gray-600/50 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#DAA520] focus:ring-2 focus:ring-[#DAA520]/30 transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        Password
                                    </label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#DAA520] group-focus-within:text-yellow-400 transition-colors" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            autoComplete="new-password"
                                            value={registerData.password}
                                            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                            placeholder="••••••••"
                                            className="w-full bg-gray-700/40 border border-gray-600/50 rounded-lg pl-12 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#DAA520] focus:ring-2 focus:ring-[#DAA520]/30 transition-all"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#DAA520] transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        Confirm Password
                                    </label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#DAA520] group-focus-within:text-yellow-400 transition-colors" />
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            autoComplete="new-password"
                                            value={registerData.confirmPassword}
                                            onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                                            placeholder="••••••••"
                                            className="w-full bg-gray-700/40 border border-gray-600/50 rounded-lg pl-12 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#DAA520] focus:ring-2 focus:ring-[#DAA520]/30 transition-all"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#DAA520] transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-[#DAA520] to-[#c99416] hover:from-[#c99416] hover:to-[#b8820f] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 mt-6 shadow-lg shadow-[#DAA520]/20 transition-all"
                                >
                                    {loading ? (
                                        <>
                                            <Loader className="w-5 h-5 animate-spin" />
                                            Creating Account...
                                        </>
                                    ) : (
                                        <>Create Your Account</>
                                    )}
                                </Button>
                            </form>
                        )}

                    </div>
                </Card>

                {/* Footer */}
                <p className="text-center text-gray-500 text-xs mt-8">
                    © 2025 ASR Aviation. All rights reserved. <br /> Premium Private Jet Charter Services
                </p>
            </div>
        </div>
    );
}