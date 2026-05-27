'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFinanceStore } from '@/store/useFinanceStore';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Mail, Lock, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export default function LoginPage() {
  const router = useRouter();
  const setUser = useFinanceStore(state => state.setUser);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isOtp, setIsOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setFieldErrors({});

    // Client-side Zod validation
    if (!isOtp) {
      const result = LoginSchema.safeParse({ email, password });
      if (!result.success) {
        const errs: { email?: string; password?: string } = {};
        result.error.issues.forEach(err => {
          const field = err.path[0] as 'email' | 'password';
          errs[field] = err.message;
        });
        setFieldErrors(errs);
        return;
      }
    }

    setLoading(true);

    try {
      if (isSupabaseConfigured && supabase) {
        if (isOtp && otpSent) {
          // Verify OTP
          const { data, error } = await supabase.auth.verifyOtp({
            email,
            token: otpCode,
            type: 'email',
          });
          if (error) throw error;
          if (data?.user) {
            const { data: profile } = await supabase
              .from('users')
              .select('*')
              .eq('id', data.user.id)
              .single();
            setUser(profile || { id: data.user.id, name: email.split('@')[0], email, currency: 'INR', monthly_allowance: 10000 });
            router.push('/dashboard');
          }
        } else {
          // Real Supabase password auth
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
          if (data?.user) {
            const { data: profile } = await supabase
              .from('users')
              .select('*')
              .eq('id', data.user.id)
              .single();
            if (profile) {
              setUser(profile);
              router.push('/dashboard');
            } else {
              setUser({ id: data.user.id, name: email.split('@')[0], email, currency: 'INR', monthly_allowance: 10000 });
              router.push('/onboarding');
            }
          }
        }
      } else {
        // Fallback Mock Auth (preview mode)
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
      // Sanitize error message — don't expose raw Supabase internals
      const msg = err.message || '';
      if (msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('wrong')) {
        setErrorMsg('Incorrect email or password. Please try again.');
      } else if (msg.toLowerCase().includes('email')) {
        setErrorMsg('Please check your email address and try again.');
      } else {
        setErrorMsg('Login failed. Please try again later.');
      }
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!email) {
      setFieldErrors({ email: 'Enter your email first to receive an OTP' });
      return;
    }
    const emailCheck = z.string().email().safeParse(email);
    if (!emailCheck.success) {
      setFieldErrors({ email: 'Please enter a valid email address' });
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) throw error;
        setOtpSent(true);
        setIsOtp(true);
      } else {
        setIsOtp(true);
        setOtpSent(true);
      }
    } catch (err: any) {
      setErrorMsg('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 sm:px-6 relative">
      {/* Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-primary-fixed/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[420px] glass-panel rounded-2xl p-6 sm:p-8 relative z-10 border-white/5 bg-black/60 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        <div className="flex flex-col gap-2 items-center text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-primary-fixed/30 bg-primary-fixed/5 font-mono text-[9px] uppercase tracking-widest text-primary-fixed">
            <Sparkles className="w-3 h-3 text-primary-fixed animate-pulse" aria-hidden="true" />
            System Portal
          </div>
          <h1 className="font-display text-2xl font-bold text-white tracking-tight mt-2">Access CapitalS</h1>
          <p className="text-xs text-on-surface-variant">Enter credentials to initialize financial workspace.</p>
        </div>

        {/* Error banner — always rendered so aria-live works */}
        <div
          role="alert"
          aria-live="assertive"
          className={`mb-4 transition-all ${errorMsg ? 'p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-xs text-red-400' : 'h-0 overflow-hidden'}`}
        >
          {errorMsg}
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4" noValidate>
          {/* Email */}
          <div className="flex flex-col gap-1">
            <label htmlFor="login-email" className="font-mono text-[10px] uppercase text-[#849495] tracking-wider">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 w-4 h-4 text-on-surface-variant/60" aria-hidden="true" />
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@college.edu"
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? 'login-email-err' : undefined}
                className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border text-sm text-white placeholder-white/20 focus:outline-none transition-colors ${fieldErrors.email ? 'border-red-500/50' : 'border-white/10 focus:border-primary-fixed'}`}
              />
            </div>
            {fieldErrors.email && (
              <span id="login-email-err" className="text-[10px] text-red-400 font-mono">{fieldErrors.email}</span>
            )}
          </div>

          {!isOtp ? (
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <label htmlFor="login-password" className="font-mono text-[10px] uppercase text-[#849495] tracking-wider">Password</label>
                <Link href="/forgot-password" className="font-mono text-[9px] uppercase tracking-wider text-primary-fixed hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 w-4 h-4 text-on-surface-variant/60" aria-hidden="true" />
                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby={fieldErrors.password ? 'login-pw-err' : undefined}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border text-sm text-white placeholder-white/20 focus:outline-none transition-colors ${fieldErrors.password ? 'border-red-500/50' : 'border-white/10 focus:border-primary-fixed'}`}
                />
              </div>
              {fieldErrors.password && (
                <span id="login-pw-err" className="text-[10px] text-red-400 font-mono">{fieldErrors.password}</span>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <label htmlFor="login-otp" className="font-mono text-[10px] uppercase text-[#849495] tracking-wider">
                {otpSent ? 'Enter OTP sent to your email' : 'Verification OTP'}
              </label>
              <div className="relative flex items-center">
                <ShieldCheck className="absolute left-3 w-4 h-4 text-on-surface-variant/60" aria-hidden="true" />
                <input
                  id="login-otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={otpCode}
                  onChange={e => setOtpCode(e.target.value)}
                  placeholder="123456"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-primary-fixed transition-colors"
                />
              </div>
              {otpSent && (
                <span className="text-[10px] text-primary-fixed/70 font-mono">Check your inbox — OTP sent to {email}</span>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="magnetic-btn w-full py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Initializing...' : isOtp ? 'Verify Code' : 'Access Dashboard'}
            {!loading && <ArrowRight className="w-4 h-4" aria-hidden="true" />}
          </button>
        </form>

        <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-white/5">
          {!isOtp ? (
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full py-3 rounded-xl border border-white/10 text-center font-mono text-xs uppercase tracking-wider hover:bg-white/5 transition-all text-white disabled:opacity-50"
            >
              Sign In with Email OTP
            </button>
          ) : (
            <button
              type="button"
              onClick={() => { setIsOtp(false); setOtpSent(false); setOtpCode(''); }}
              className="w-full py-3 rounded-xl border border-white/10 text-center font-mono text-xs uppercase tracking-wider hover:bg-white/5 transition-all text-[#b9caca]"
            >
              ← Back to Password
            </button>
          )}

          {/* Google OAuth — disabled, coming soon */}
          <button
            type="button"
            disabled
            title="Google Sign-In coming soon"
            className="w-full py-3 rounded-xl border border-white/5 text-center font-mono text-xs uppercase tracking-wider text-white/20 cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4 fill-current opacity-30 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-6.887 4.114-4.693 0-8.503-3.81-8.503-8.503s3.81-8.503 8.503-8.503c2.202 0 4.155.801 5.672 2.11l3.208-3.208C18.665.98 15.725 0 12.24 0 5.48 0 0 5.48 0 12.24s5.48 12.24 12.24 12.24c7.04 0 11.71-4.949 11.71-11.933 0-.809-.071-1.583-.21-2.262H12.24z" />
            </svg>
            Continue with Google (Coming Soon)
          </button>

          <p className="text-center text-xs text-[#849495] mt-1">
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
