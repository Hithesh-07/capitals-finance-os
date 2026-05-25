'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFinanceStore } from '@/store/useFinanceStore';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Mail, Lock, Sparkles, ArrowRight, User } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const setUser = useFinanceStore(state => state.setUser);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name
            }
          }
        });
        if (error) throw error;
        
        if (data?.user) {
          // Logged in immediately, direct to onboarding
          setUser({
            id: data.user.id,
            name: name,
            email: email,
            currency: 'INR',
            monthly_allowance: 10000
          });
          router.push('/onboarding');
        }
      } else {
        // Fallback Mock Sign up
        setLoading(true);
        setTimeout(() => {
          setUser({
            id: 'user-mock-123',
            name: name || 'Hithesh Reddy',
            email: email || 'hithesh@iitm.ac.in',
            currency: 'INR',
            monthly_allowance: 10000
          });
          router.push('/onboarding');
        }, 1000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Signup failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-margin-mobile relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-primary-fixed/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[420px] glass-panel rounded-2xl p-8 relative z-10 border-white/5 bg-black/60 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        <div className="flex flex-col gap-2 items-center text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-primary-fixed/30 bg-primary-fixed/5 font-mono text-[9px] uppercase tracking-widest text-primary-fixed">
            <Sparkles className="w-3 h-3 text-primary-fixed animate-pulse" />
            System Portal
          </div>
          <h1 className="font-display text-2xl font-bold text-white tracking-tight mt-2">Initialize Account</h1>
          <p className="text-xs text-on-surface-variant">Sign up to create your student finance profile.</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-xs text-red-400">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-mono text-[10px] uppercase text-[#849495] tracking-wider">Full Name</label>
            <div className="relative flex items-center">
              <User className="absolute left-3 w-4 h-4 text-on-surface-variant/60" />
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Hithesh Reddy"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-primary-fixed transition-colors"
              />
            </div>
          </div>

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

          <div className="flex flex-col gap-1">
            <label className="font-mono text-[10px] uppercase text-[#849495] tracking-wider">Password</label>
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

          <button
            type="submit"
            disabled={loading}
            className="magnetic-btn w-full py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 mt-2"
          >
            {loading ? 'Initializing Profile...' : 'Create Account'}
            {!loading && <ArrowRight className="w-4 h-4" />}
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
