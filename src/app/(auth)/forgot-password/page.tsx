'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Sparkles, ArrowRight } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-margin-mobile relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-primary-fixed/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[420px] glass-panel rounded-2xl p-8 relative z-10 border-white/5 bg-black/60 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        <div className="flex flex-col gap-2 items-center text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-primary-fixed/30 bg-primary-fixed/5 font-mono text-[9px] uppercase tracking-widest text-primary-fixed">
            <Sparkles className="w-3 h-3 text-primary-fixed animate-pulse" />
            Security Vault
          </div>
          <h1 className="font-display text-2xl font-bold text-white tracking-tight mt-2">Reset Password</h1>
          <p className="text-xs text-on-surface-variant">Request password recovery links.</p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/3 border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-primary-fixed transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="magnetic-btn w-full py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 mt-2"
            >
              Send Reset Instructions
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <div className="text-center flex flex-col gap-4 py-4">
            <p className="text-sm text-on-surface-variant leading-relaxed">
              If an account exists for <span className="text-white font-semibold">{email}</span>, a recovery link has been dispatched. Check your spam folder if it doesn't arrive in 5 minutes.
            </p>
          </div>
        )}

        <p className="text-center text-xs text-[#849495] mt-6">
          Remember password?{' '}
          <Link href="/login" className="text-primary-fixed hover:underline font-semibold">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
