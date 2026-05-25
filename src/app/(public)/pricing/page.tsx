import React from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-20 flex flex-col gap-12">
      <div className="text-center max-w-2xl mx-auto flex flex-col gap-4">
        <span className="font-mono text-xs uppercase text-primary-fixed tracking-widest">Subscription Models</span>
        <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tighter text-white">Pricing Plans</h1>
        <p className="font-sans text-base text-on-surface-variant leading-relaxed">
          Start for free, upgrade when you want predictive analytics, loan due alerts, and automated splits.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-[800px] mx-auto mt-8">
        {/* Free Plan */}
        <div className="glass-panel p-8 rounded-2xl flex flex-col gap-6">
          <div>
            <span className="font-mono text-[10px] uppercase text-[#849495] tracking-widest">Base Tier</span>
            <h3 className="font-display text-2xl font-bold text-white mt-1">Capital Free</h3>
            <p className="text-sm text-[#b9caca] mt-2">Essential features for logging allowances and simple split bills.</p>
          </div>
          <div className="font-display text-4xl font-bold text-white">
            ₹0 <span className="text-sm font-sans font-normal text-on-surface-variant">/ forever</span>
          </div>
          <div className="h-[1px] bg-white/10 w-full" />
          <ul className="flex flex-col gap-3 text-sm text-[#e5e2e1]">
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-fixed" /> Track Income & Expenses</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-fixed" /> Core Budgets & Goals</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-fixed" /> Split Bills with Friends</li>
          </ul>
          <Link href="/signup" className="w-full py-3 rounded-xl border border-white/10 hover:border-white/30 text-center font-mono text-xs uppercase tracking-wider hover:bg-white/5 transition-all text-white mt-auto">
            Initialize Free Plan
          </Link>
        </div>

        {/* Premium Plan */}
        <div className="glass-panel p-8 rounded-2xl flex flex-col gap-6 border-primary-fixed/30 bg-primary-fixed/5">
          <div className="flex justify-between items-start">
            <div>
              <span className="font-mono text-[10px] uppercase text-primary-fixed tracking-widest">Advanced Telemetry</span>
              <h3 className="font-display text-2xl font-bold text-white mt-1">Capital Premium</h3>
              <p className="text-sm text-[#b9caca] mt-2">Unlock Brokeman Mode runway prediction and automatic receipt scanner.</p>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-black font-mono text-[8px] font-bold uppercase tracking-wider">Student Favorite</span>
          </div>
          <div className="font-display text-4xl font-bold text-white">
            ₹49 <span className="text-sm font-sans font-normal text-on-surface-variant">/ month</span>
          </div>
          <div className="h-[1px] bg-white/10 w-full" />
          <ul className="flex flex-col gap-3 text-sm text-[#e5e2e1]">
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-fixed" /> Everything in Free</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-fixed" /> Brokeman Runway predictions</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-fixed" /> Loan Sentinel due date countdowns</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-fixed" /> AI Receipt & UPI scanner</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-fixed" /> WhatsApp Settlement reminders</li>
          </ul>
          <Link href="/signup" className="w-full py-3 rounded-xl bg-primary-fixed text-black text-center font-mono text-xs uppercase tracking-wider font-bold hover:shadow-[0_0_20px_rgba(99,247,255,0.4)] hover:scale-[1.01] transition-all">
            Unlock Full System
          </Link>
        </div>
      </div>
    </div>
  );
}
