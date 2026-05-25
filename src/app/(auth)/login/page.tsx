'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFinanceStore } from '@/store/useFinanceStore';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Mail, Lock, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const setUser = useFinanceStore(state => state.setUser);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isOtp, setIsOtp] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isSupabaseConfigured && supabase) {
        // Real Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        
        if (data?.user) {
          // Fetch profile and store in Zustand
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single();
          
          if (profile) {
            setUser(profile);
            router.push('/dashboard');
          } else {
            // Profile doesn't exist, go to onboarding
            setUser({
              id: data.user.id,
              name: email.split('@')[0],
              email: email,
              currency: 'INR',
              monthly_allowance: 10000
            });
            router.push('/onboarding');
          }
        }
      } else {
        // Fallback Mock Auth
        setLoading(true);
        setTimeout(() => {
          setUser({
            id: 'user-mock-123',
            name: email.split('@')[0] || 'Hithesh Reddy',
            email: email || 'hithesh@iitm.ac.in',
            currency: 'INR',
            monthly_allowance: 12000,
            college: 'IIT Madras',
            city: 'Chennai',
            student_type: 'undergraduate',
            main_income_source: 'parents'
          });
          router.push('/dashboard');
        }, 1000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  const handleSendOtp = () => {
    setIsOtp(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-margin-mobile relative">
      {/* Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-primary-fixed/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[420px] glass-panel rounded-2xl p-8 relative z-10 border-white/5 bg-black/60 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        <div className="flex flex-col gap-2 items-center text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-primary-fixed/30 bg-primary-fixed/5 font-mono text-[9px] uppercase tracking-widest text-primary-fixed">
            <Sparkles className="w-3 h-3 text-primary-fixed animate-pulse" />
            System Portal
          </div>
          <h1 className="font-display text-2xl font-bold text-white tracking-tight mt-2">Access CapitalS</h1>
          <p className="text-xs text-on-surface-variant">Enter credentials to initialize financial workspace.</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-xs text-red-400">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-mono text-[10px] uppercase text-[#849495] tracking-wider">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 w-4 h-4 text-on-surface-variant/60" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@college.edu"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-primary-fixed transition-colors"
              />
            </div>
          </div>

          {!isOtp ? (
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <label className="font-mono text-[10px] uppercase text-[#849495] tracking-wider">Password</label>
                <Link href="/forgot-password" className="font-mono text-[9px] uppercase tracking-wider text-primary-fixed hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 w-4 h-4 text-on-surface-variant/60" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-primary-fixed transition-colors"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <label className="font-mono text-[10px] uppercase text-[#849495] tracking-wider">Verification OTP</label>
              <div className="relative flex items-center">
                <ShieldCheck className="absolute left-3 w-4 h-4 text-on-surface-variant/60" />
                <input
                  type="text"
                  required
                  value={otpCode}
                  onChange={e => setOtpCode(e.target.value)}
                  placeholder="123456"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-primary-fixed transition-colors"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="magnetic-btn w-full py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 mt-2"
          >
            {loading ? 'Initializing...' : isOtp ? 'Verify Code' : 'Access Dashboard'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="flex flex-col gap-4 mt-8 pt-6 border-t border-white/5">
          {!isOtp && (
            <button
              onClick={handleSendOtp}
              className="w-full py-3 rounded-xl border border-white/10 text-center font-mono text-xs uppercase tracking-wider hover:bg-white/5 transition-all text-white"
            >
              Sign In with Email OTP
            </button>
          )}

          {/* Social login */}
          <button
            type="button"
            onClick={handleLogin}
            className="w-full py-3 rounded-xl border border-white/10 text-center font-mono text-xs uppercase tracking-wider hover:bg-white/5 transition-all text-[#b9caca] flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4 text-white shrink-0 fill-current" viewBox="0 0 24 24">
              <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-6.887 4.114-4.693 0-8.503-3.81-8.503-8.503s3.81-8.503 8.503-8.503c2.202 0 4.155.801 5.672 2.11l3.208-3.208C18.665.98 15.725 0 12.24 0 5.48 0 0 5.48 0 12.24s5.48 12.24 12.24 12.24c7.04 0 11.71-4.949 11.71-11.933 0-.809-.071-1.583-.21-2.262H12.24z" />
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-xs text-[#849495] mt-2">
            No account?{' '}
            <Link href="/signup" className="text-primary-fixed hover:underline font-semibold">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
