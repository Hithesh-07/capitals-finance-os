'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFinanceStore } from '@/store/useFinanceStore';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Mail, Lock, Sparkles, ArrowRight, User } from 'lucide-react';
import { z } from 'zod';

const SignupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type FieldErrors = { name?: string; email?: string; password?: string };

function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score, label: 'Weak', color: '#ef4444' };
  if (score === 2) return { score, label: 'Fair', color: '#f97316' };
  if (score === 3) return { score, label: 'Good', color: '#eab308' };
  return { score, label: 'Strong', color: '#22c55e' };
}

export default function SignupPage() {
  const router = useRouter();
  const setUser = useFinanceStore(state => state.setUser);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const pwStrength = password.length > 0 ? getPasswordStrength(password) : null;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setFieldErrors({});

    // Client-side Zod validation
    const result = SignupSchema.safeParse({ name, email, password });
    if (!result.success) {
      const errs: FieldErrors = {};
      result.error.issues.forEach(err => {
        const field = err.path[0] as keyof FieldErrors;
        if (!errs[field]) errs[field] = err.message;
      });
      setFieldErrors(errs);
      return;
    }

    setLoading(true);

    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } }
        });
        if (error) throw error;
        if (data?.user) {
          setUser({ id: data.user.id, name, email, currency: 'INR', monthly_allowance: 10000 });
          router.push('/onboarding');
        }
      } else {
        // Fallback mock mode
        setTimeout(() => {
          setUser({ id: 'user-mock-123', name: name || 'Hithesh Reddy', email: email || 'hithesh@iitm.ac.in', currency: 'INR', monthly_allowance: 10000 });
          router.push('/onboarding');
        }, 1000);
      }
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.toLowerCase().includes('already registered') || msg.toLowerCase().includes('already exists')) {
        setErrorMsg('An account with this email already exists. Try logging in instead.');
      } else if (msg.toLowerCase().includes('password')) {
        setErrorMsg('Password does not meet requirements. Please use at least 8 characters.');
      } else {
        setErrorMsg('Signup failed. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 sm:px-6 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-primary-fixed/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[420px] glass-panel rounded-2xl p-6 sm:p-8 relative z-10 border-white/5 bg-black/60 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        <div className="flex flex-col gap-2 items-center text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-primary-fixed/30 bg-primary-fixed/5 font-mono text-[9px] uppercase tracking-widest text-primary-fixed">
            <Sparkles className="w-3 h-3 text-primary-fixed animate-pulse" aria-hidden="true" />
            System Portal
          </div>
          <h1 className="font-display text-2xl font-bold text-white tracking-tight mt-2">Initialize Account</h1>
          <p className="text-xs text-on-surface-variant">Sign up to create your student finance profile.</p>
        </div>

        {/* Error banner — always rendered for aria-live to work */}
        <div
          role="alert"
          aria-live="assertive"
          className={`mb-4 transition-all ${errorMsg ? 'p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-xs text-red-400' : 'h-0 overflow-hidden'}`}
        >
          {errorMsg}
        </div>

        <form onSubmit={handleSignup} className="flex flex-col gap-4" noValidate>
          {/* Name */}
          <div className="flex flex-col gap-1">
            <label htmlFor="signup-name" className="font-mono text-[10px] uppercase text-[#849495] tracking-wider">Full Name</label>
            <div className="relative flex items-center">
              <User className="absolute left-3 w-4 h-4 text-on-surface-variant/60" aria-hidden="true" />
              <input
                id="signup-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Hithesh Reddy"
                aria-invalid={!!fieldErrors.name}
                aria-describedby={fieldErrors.name ? 'signup-name-err' : undefined}
                className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border text-sm text-white placeholder-white/20 focus:outline-none transition-colors ${fieldErrors.name ? 'border-red-500/50' : 'border-white/10 focus:border-primary-fixed'}`}
              />
            </div>
            {fieldErrors.name && (
              <span id="signup-name-err" className="text-[10px] text-red-400 font-mono">{fieldErrors.name}</span>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label htmlFor="signup-email" className="font-mono text-[10px] uppercase text-[#849495] tracking-wider">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 w-4 h-4 text-on-surface-variant/60" aria-hidden="true" />
              <input
                id="signup-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@college.edu"
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? 'signup-email-err' : undefined}
                className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border text-sm text-white placeholder-white/20 focus:outline-none transition-colors ${fieldErrors.email ? 'border-red-500/50' : 'border-white/10 focus:border-primary-fixed'}`}
              />
            </div>
            {fieldErrors.email && (
              <span id="signup-email-err" className="text-[10px] text-red-400 font-mono">{fieldErrors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label htmlFor="signup-password" className="font-mono text-[10px] uppercase text-[#849495] tracking-wider">Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 w-4 h-4 text-on-surface-variant/60" aria-hidden="true" />
              <input
                id="signup-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min 8 characters"
                aria-invalid={!!fieldErrors.password}
                aria-describedby={[
                  fieldErrors.password ? 'signup-pw-err' : '',
                  'signup-pw-strength'
                ].filter(Boolean).join(' ') || undefined}
                className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border text-sm text-white placeholder-white/20 focus:outline-none transition-colors ${fieldErrors.password ? 'border-red-500/50' : 'border-white/10 focus:border-primary-fixed'}`}
              />
            </div>

            {/* Password strength bar */}
            {password.length > 0 && pwStrength && (
              <div id="signup-pw-strength" aria-live="polite" className="flex flex-col gap-1 mt-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      className="h-1 flex-1 rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: i <= Math.ceil(pwStrength.score / 1.25)
                          ? pwStrength.color
                          : 'rgba(255,255,255,0.08)'
                      }}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-mono" style={{ color: pwStrength.color }}>
                  Strength: {pwStrength.label}
                  {pwStrength.score < 3 && ' — add uppercase letters, numbers or symbols'}
                </span>
              </div>
            )}

            {fieldErrors.password && (
              <span id="signup-pw-err" className="text-[10px] text-red-400 font-mono">{fieldErrors.password}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="magnetic-btn w-full py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Initializing Profile...' : 'Create Account'}
            {!loading && <ArrowRight className="w-4 h-4" aria-hidden="true" />}
          </button>
        </form>

        <p className="text-center text-xs text-[#849495] mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-primary-fixed hover:underline font-semibold">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
