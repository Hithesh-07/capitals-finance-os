'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Shield, Zap, Sparkles, CircleDollarSign, 
  HelpCircle, ChevronDown, Check, Coins, TrendingUp, AlertTriangle, Coffee, Plane
} from 'lucide-react';

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "How does CapitalS track my allowance and freelance payments?",
      a: "CapitalS is designed for students. You can log recurring allowances (like pocket money from parents), variable internship stipends, and freelance client invoices. The dashboard aggregates this into a single 'Total Inflow Velocity' meter."
    },
    {
      q: "What is Brokeman Mode and how does it predict my cashflow?",
      a: "Brokeman Mode calculates your daily disposable runway. It analyzes your average daily spend (burn rate) from the last 7 days and divides your remaining balance by it, predicting the exact date you will run out of cash. It warns you before you become dependent on loans!"
    },
    {
      q: "Can I manage app-based loans like mPokket or KreditBee?",
      a: "Yes! The Loan Sentinel module tracks your short-term loans, EMI schedules, and principal balances, and features an active, live countdown timer down to the minute so you never miss a payment or incur high interest fees."
    },
    {
      q: "How does the split expense system work?",
      a: "You can add your friends (via phone/UPI) and split any expense instantly. You can track net balances (who owes whom) and generate instant WhatsApp settlement reminders with direct UPI deep links."
    }
  ];

  return (
    <div className="w-full relative overflow-hidden bg-black py-12 flex flex-col items-center">
      {/* BACKGROUND GRID */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />

      {/* HERO SECTION */}
      <section className="relative z-10 w-full max-w-container-max px-margin-mobile md:px-margin-desktop text-center pt-16 md:pt-24 flex flex-col items-center gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary-fixed/20 bg-primary-fixed/5 font-mono text-[10px] uppercase tracking-widest text-primary-fixed"
        >
          <Sparkles className="w-3.5 h-3.5 text-primary-fixed animate-pulse" />
          The Student Financial Operating System
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-4xl md:text-7xl font-bold tracking-tighter text-white max-w-4xl leading-tight"
        >
          Your Income, <span className="text-primary-fixed drop-shadow-[0_0_15px_rgba(99,247,255,0.3)]">Orchestrated.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-base md:text-xl text-on-surface-variant max-w-2xl leading-relaxed font-sans"
        >
          Stop struggling with budgeting apps made for salaried corporate adults. CapitalS is the first premium ecosystem built specifically for students with pocket money, freelance stipends, splits, and EMIs.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-4"
        >
          <Link 
            href="/signup" 
            className="magnetic-btn px-8 py-4 rounded-full font-mono text-sm uppercase tracking-wider font-bold flex items-center gap-2 group"
          >
            Launch System
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a 
            href="#features" 
            className="px-8 py-4 rounded-full font-mono text-sm uppercase tracking-wider font-semibold border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all text-white"
          >
            Explore Telemetry
          </a>
        </motion.div>
      </section>

      {/* INTERACTIVE EXPENSE ORBIT PREVIEW */}
      <section className="relative z-10 w-full max-w-container-max px-margin-mobile md:px-margin-desktop py-20 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="w-full max-w-[850px] aspect-[16/10] glass-panel rounded-3xl p-8 relative flex flex-col md:flex-row gap-8 overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] border-white/5"
        >
          {/* Neon mesh glow inside card */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,247,255,0.03)_0%,transparent_60%)] pointer-events-none" />

          {/* Orbit simulator (Left side) */}
          <div className="flex-1 min-h-[250px] md:min-h-0 relative flex items-center justify-center orb-container border border-white/5 rounded-2xl bg-black/40 overflow-hidden">
            {/* Center Core */}
            <div className="absolute w-24 h-24 rounded-full glass-panel flex items-center justify-center z-10 shadow-[0_0_30px_rgba(99,247,255,0.1)] border-primary-fixed/20">
              <span className="font-mono text-xs uppercase text-primary-fixed tracking-widest">Core</span>
            </div>

            {/* Food Orbit (Inner) */}
            <div className="orbit-track orbit-rotate" style={{ animationDuration: '18s' }}>
              <div 
                className="orb w-28 h-28 rounded-full glass-panel flex flex-col items-center justify-center cursor-pointer border-tertiary-fixed/30 bg-tertiary-fixed/5 backdrop-blur-md hover:scale-110"
                style={{ transform: 'translate3d(120px, 0, 0)' }}
              >
                <Coffee className="w-5 h-5 text-tertiary-fixed mb-1" />
                <span className="font-mono text-[9px] uppercase tracking-wider text-tertiary-fixed">Food</span>
                <div className="orb-content absolute inset-0 rounded-full bg-black/95 flex flex-col items-center justify-center p-2 text-center">
                  <span className="font-display font-semibold text-white text-sm">₹2,450</span>
                  <span className="font-mono text-[8px] text-[#849495] mt-0.5">Zomato/Mess</span>
                </div>
              </div>
            </div>

            {/* Travel Orbit (Outer) */}
            <div className="orbit-track orbit-rotate-reverse" style={{ animationDuration: '24s' }}>
              <div 
                className="orb w-32 h-32 rounded-full glass-panel flex flex-col items-center justify-center cursor-pointer border-primary-fixed/30 bg-primary-fixed/5 backdrop-blur-md hover:scale-110"
                style={{ transform: 'translate3d(-170px, 10px, 0)' }}
              >
                <Plane className="w-6 h-6 text-primary-fixed mb-1" />
                <span className="font-mono text-[9px] uppercase tracking-wider text-primary-fixed">Travel</span>
                <div className="orb-content absolute inset-0 rounded-full bg-black/95 flex flex-col items-center justify-center p-2 text-center">
                  <span className="font-display font-semibold text-white text-sm">₹4,120</span>
                  <span className="font-mono text-[8px] text-[#849495] mt-0.5">Metro/Uber</span>
                </div>
              </div>
            </div>
          </div>

          {/* Explanation panel (Right side) */}
          <div className="w-full md:w-[300px] flex flex-col justify-center gap-6 relative z-10">
            <span className="font-mono text-xs uppercase tracking-widest text-[#849495]">Live Interface Preview</span>
            <h3 className="font-display text-2xl font-bold text-white tracking-tight">Expense Orbit</h3>
            <p className="font-sans text-sm text-[#b9caca] leading-relaxed">
              Visualize your monthly cash outflows dynamically. Interactive categories float around your financial core. Hover a sphere to expand telemetry and check subcategory spending.
            </p>
            <div className="h-[1px] bg-white/10 w-full" />
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase text-primary-fixed tracking-wider">Features included:</span>
              <ul className="grid grid-cols-2 gap-2 text-xs text-on-surface">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-primary-fixed" /> Hover expansion</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-primary-fixed" /> 3D depth-effect</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-primary-fixed" /> Live sync</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-primary-fixed" /> Dynamic glowing</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CORE FEATURES BENTO GRID */}
      <section id="features" className="relative z-10 w-full max-w-container-max px-margin-mobile md:px-margin-desktop py-20 flex flex-col items-center gap-16">
        <div className="text-center flex flex-col items-center gap-3">
          <span className="font-mono text-xs uppercase text-primary-fixed tracking-widest">Platform Core Modules</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white tracking-tighter">Everything a student needs to survive & thrive.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {/* Card 1: Brokeman Mode */}
          <div className="glass-panel p-8 rounded-2xl flex flex-col gap-4 group">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20 group-hover:border-red-500/40 transition-colors">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-display text-xl font-bold text-white">Brokeman Runway Engine</h3>
            <p className="text-sm text-[#b9caca] leading-relaxed">
              Predicts your balance exhaustion date down to the day using a 7-day rolling burn rate. Calculates daily disposable runways to keep you afloat.
            </p>
          </div>

          {/* Card 2: Loan Sentinel */}
          <div className="glass-panel p-8 rounded-2xl flex flex-col gap-4 group">
            <div className="w-12 h-12 rounded-xl bg-primary-fixed/10 flex items-center justify-center border border-primary-fixed/20 group-hover:border-primary-fixed/40 transition-colors">
              <Coins className="w-6 h-6 text-primary-fixed" />
            </div>
            <h3 className="font-display text-xl font-bold text-white">Loan Sentinel</h3>
            <p className="text-sm text-[#b9caca] leading-relaxed">
              Tracks micro-loans from mPokket, Slice, or KreditBee. Includes live countdown clocks for due dates so you never pay hefty interest penalties.
            </p>
          </div>

          {/* Card 3: Split System */}
          <div className="glass-panel p-8 rounded-2xl flex flex-col gap-4 group">
            <div className="w-12 h-12 rounded-xl bg-secondary-container/10 flex items-center justify-center border border-secondary-container/20 group-hover:border-secondary-container/40 transition-colors">
              <Zap className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="font-display text-xl font-bold text-white">WhatsApp Split Links</h3>
            <p className="text-sm text-[#b9caca] leading-relaxed">
              Split bills instantly with hostel mates or trip partners. Generates custom UPI links to share on WhatsApp with direct request payloads.
            </p>
          </div>

          {/* Card 4: Impulse Guard */}
          <div className="glass-panel p-8 rounded-2xl flex flex-col gap-4 group">
            <div className="w-12 h-12 rounded-xl bg-tertiary-fixed/10 flex items-center justify-center border border-tertiary-fixed/20 group-hover:border-tertiary-fixed/40 transition-colors">
              <Shield className="w-6 h-6 text-tertiary-fixed" />
            </div>
            <h3 className="font-display text-xl font-bold text-white">Impulse Guard</h3>
            <p className="text-sm text-[#b9caca] leading-relaxed">
              Tag expenses as Need, Want, or Impulse. Generates monthly behavioral summaries to show how much you could have saved by skipping impulse purchases.
            </p>
          </div>

          {/* Card 5: SIP Tracker */}
          <div className="glass-panel p-8 rounded-2xl flex flex-col gap-4 group">
            <div className="w-12 h-12 rounded-xl bg-primary-fixed/10 flex items-center justify-center border border-primary-fixed/20 group-hover:border-primary-fixed/40 transition-colors">
              <TrendingUp className="w-6 h-6 text-primary-fixed" />
            </div>
            <h3 className="font-display text-xl font-bold text-white">SIP Investment Vault</h3>
            <p className="text-sm text-[#b9caca] leading-relaxed">
              Link small-ticket mutual fund investments via Groww/Zerodha. Monitor total capital growth, compound interest estimates, and track goal milestones.
            </p>
          </div>

          {/* Card 6: Gamified Savings */}
          <div className="glass-panel p-8 rounded-2xl flex flex-col gap-4 group">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 group-hover:border-yellow-500/40 transition-colors">
              <Sparkles className="w-6 h-6 text-yellow-500" />
            </div>
            <h3 className="font-display text-xl font-bold text-white">No-Spend Streaks</h3>
            <p className="text-sm text-[#b9caca] leading-relaxed">
              Collect badges, view saving streak scorecards, and beat monthly frugality challenges to build solid wealth-building habits early in life.
            </p>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="relative z-10 w-full max-w-container-max px-margin-mobile md:px-margin-desktop py-20 flex flex-col items-center gap-12">
        <div className="text-center flex flex-col items-center gap-3">
          <span className="font-mono text-xs uppercase text-primary-fixed tracking-widest">Simple Tiering</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white tracking-tighter">Choose Your Plan</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-[800px]">
          {/* Free Tier */}
          <div className="glass-panel p-8 rounded-2xl flex flex-col gap-6 border-white/5 bg-white/2">
            <div>
              <span className="font-mono text-[10px] uppercase text-[#849495] tracking-widest">Base Layer</span>
              <h3 className="font-display text-2xl font-bold text-white mt-1">Beta Free</h3>
              <p className="text-sm text-[#b9caca] mt-2">Essential features for tracking personal budgets and split bills.</p>
            </div>
            <div className="font-display text-4xl font-bold text-white">
              ₹0 <span className="text-sm font-sans font-normal text-on-surface-variant">/ forever</span>
            </div>
            <div className="h-[1px] bg-white/10 w-full" />
            <ul className="flex flex-col gap-3 text-sm text-[#e5e2e1]">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-fixed" /> Track Income & Expenses</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-fixed" /> Basic Category Budgets</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-fixed" /> Split Bills with Friends</li>
              <li className="flex items-center gap-2 text-white/40"><Check className="w-4 h-4 text-white/20" /> No Brokeman Mode runway</li>
              <li className="flex items-center gap-2 text-white/40"><Check className="w-4 h-4 text-white/20" /> No Loan Sentinel countdowns</li>
            </ul>
            <Link href="/signup" className="w-full py-3 rounded-xl border border-white/10 hover:border-white/30 text-center font-mono text-xs uppercase tracking-wider hover:bg-white/5 transition-all text-white mt-auto">
              Initialize Free Client
            </Link>
          </div>

          {/* Premium Tier */}
          <div className="glass-panel p-8 rounded-2xl flex flex-col gap-6 border-primary-fixed/30 bg-primary-fixed/2 shadow-[0_15px_30px_rgba(99,247,255,0.05)]">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[10px] uppercase text-primary-fixed tracking-widest">Full Velocity</span>
                <h3 className="font-display text-2xl font-bold text-white mt-1">Capital Premium</h3>
                <p className="text-sm text-[#b9caca] mt-2">Unlock all analytical predictive modules and OCR receipt scanning.</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-black font-mono text-[8px] font-bold uppercase tracking-wider">Recommended</span>
            </div>
            <div className="font-display text-4xl font-bold text-white">
              ₹49 <span className="text-sm font-sans font-normal text-on-surface-variant">/ month</span>
            </div>
            <div className="h-[1px] bg-white/10 w-full" />
            <ul className="flex flex-col gap-3 text-sm text-[#e5e2e1]">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-fixed" /> Everything in Free</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-fixed" /> Full Brokeman Mode Runway</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-fixed" /> Loan Sentinel countdown widgets</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-fixed" /> AI Receipt Scanner (OCR)</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-fixed" /> WhatsApp Settlement links</li>
            </ul>
            <Link href="/signup" className="w-full py-3 rounded-xl bg-primary-fixed text-black text-center font-mono text-xs uppercase tracking-wider font-bold hover:shadow-[0_0_20px_rgba(99,247,255,0.4)] hover:scale-[1.01] transition-all">
              Unlock Premium Access
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="relative z-10 w-full max-w-[800px] px-margin-mobile md:px-gutter py-20 flex flex-col gap-12">
        <div className="text-center flex flex-col items-center gap-3">
          <span className="font-mono text-xs uppercase text-primary-fixed tracking-widest">Questions & Telemetry</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white tracking-tighter">Frequently Answered</h2>
        </div>

        <div className="flex flex-col gap-4 w-full">
          {faqs.map((faq, index) => (
            <div key={index} className="glass-panel rounded-xl overflow-hidden">
              <button 
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-white/2 transition-colors"
              >
                <span className="font-display font-semibold text-white text-base md:text-lg flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-primary-fixed shrink-0" />
                  {faq.q}
                </span>
                <ChevronDown className={`w-5 h-5 text-[#849495] transition-transform duration-300 ${activeFaq === index ? 'rotate-180 text-white' : ''}`} />
              </button>
              
              <motion.div 
                initial={false}
                animate={{ height: activeFaq === index ? 'auto' : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 text-sm text-[#b9caca] leading-relaxed border-t border-white/5 pt-4">
                  {faq.a}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
