'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFinanceStore } from '@/store/useFinanceStore';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, ArrowRight, ArrowLeft, GraduationCap, 
  Wallet, Briefcase, Landmark, TrendingUp, ShieldAlert, BadgeIndianRupee
} from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, setUser, addBudget, addLoan, addSip, isPreviewMode } = useFinanceStore();
  const [step, setStep] = useState(1);

  // States
  const [studentType, setStudentType] = useState('undergraduate');
  const [allowance, setAllowance] = useState(10000);
  const [incomeSource, setIncomeSource] = useState('parents');
  const [hasLoan, setHasLoan] = useState(false);
  const [lenderName, setLenderName] = useState('mPokket');
  const [loanPrincipal, setLoanPrincipal] = useState(3000);
  const [hasSip, setHasSip] = useState(false);
  const [sipAmount, setSipAmount] = useState(1000);
  const [foodBudget, setFoodBudget] = useState(3000);
  const [travelBudget, setTravelBudget] = useState(1500);
  const [shoppingBudget, setShoppingBudget] = useState(2000);

  const nextStep = () => setStep(s => Math.min(6, s + 1));
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  const handleFinish = async () => {
    try {
      const updatedUser = {
        ...user,
        id: user?.id || 'user-mock-123',
        name: user?.name || 'Student User',
        email: user?.email || 'student@college.edu',
        student_type: studentType,
        monthly_allowance: allowance,
        main_income_source: incomeSource,
        has_loan: hasLoan,
        has_sip: hasSip,
        currency: 'INR'
      };

      // Set user profile in Zustand
      setUser(updatedUser);

      // If Supabase is active, sync user row
      if (!isPreviewMode && supabase) {
        await supabase.from('users').upsert(updatedUser);
      }

      // Add budget categories
      const m = new Date().getMonth() + 1;
      const y = new Date().getFullYear();
      await addBudget('Food & Dining', foodBudget, m, y, true);
      await addBudget('Travel', travelBudget, m, y, false);
      await addBudget('Shopping', shoppingBudget, m, y, false);

      // Add loan if checked
      if (hasLoan && lenderName && loanPrincipal > 0) {
        const todayStr = new Date().toISOString().split('T')[0];
        const nextMonthStr = new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0];
        await addLoan(lenderName, loanPrincipal, 24, loanPrincipal / 3, todayStr, nextMonthStr, 'app');
      }

      // Add SIP if checked
      if (hasSip && sipAmount > 0) {
        const todayStr = new Date().toISOString().split('T')[0];
        const nextMonthStr = new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0];
        await addSip('Quant Small Cap Mutual Fund', sipAmount, todayStr, nextMonthStr, 'mutual_fund');
      }

      router.push('/dashboard');
    } catch (e) {
      console.error("Error saving onboarding details", e);
    }
  };

  const stepsInfo = [
    { title: "Select Student Track", desc: "Select your current educational level." },
    { title: "Monthly Allowance", desc: "How much capital do you receive each month?" },
    { title: "Main Income Stream", desc: "Where does your main support come from?" },
    { title: "Active Loans", desc: "Do you have active micro-loans to monitor?" },
    { title: "SIP Investments", desc: "Are you investing in mutual funds or stocks?" },
    { title: "Budget Setup", desc: "Establish monthly limits for core categories." }
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col justify-between items-center py-12 px-margin-mobile relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary-fixed/5 blur-[150px] pointer-events-none" />

      {/* Top progress */}
      <div className="w-full max-w-[600px] flex flex-col items-center gap-4 relative z-10">
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-primary-fixed/30 bg-primary-fixed/5 font-mono text-[9px] uppercase tracking-widest text-primary-fixed">
          <Sparkles className="w-3.5 h-3.5 text-primary-fixed" />
          Onboarding Terminal
        </div>
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden flex">
          <div 
            className="h-full bg-gradient-to-r from-primary-fixed to-secondary-container transition-all duration-500" 
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>
        <div className="flex justify-between w-full text-xs text-[#849495] font-mono uppercase tracking-wider px-1">
          <span>Step {step} of 6</span>
          <span>{stepsInfo[step - 1].title}</span>
        </div>
      </div>

      {/* Main card */}
      <div className="w-full max-w-[500px] my-auto relative z-10">
        <AnimatePresence mode="wait">
          <motion.div 
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="glass-panel p-8 rounded-2xl border-white/5 bg-black/60 shadow-[0_30px_60px_rgba(0,0,0,0.8)] min-h-[350px] flex flex-col justify-between"
          >
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="font-display text-xl font-bold text-white tracking-tight">{stepsInfo[step - 1].title}</h2>
                <p className="text-xs text-on-surface-variant mt-1">{stepsInfo[step - 1].desc}</p>
              </div>

              {/* STEP 1: Student Type */}
              {step === 1 && (
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'school', label: 'School Student', icon: GraduationCap },
                    { id: 'undergraduate', label: 'Undergraduate', icon: GraduationCap },
                    { id: 'postgraduate', label: 'Postgraduate', icon: GraduationCap },
                    { id: 'self_taught', label: 'Self-Taught', icon: GraduationCap }
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setStudentType(t.id)}
                      className={`p-4 rounded-xl border flex flex-col items-center gap-2 text-center transition-all ${
                        studentType === t.id 
                          ? 'border-primary-fixed bg-primary-fixed/5 text-primary-fixed' 
                          : 'border-white/10 hover:border-white/20 text-[#b9caca]'
                      }`}
                    >
                      <t.icon className="w-6 h-6" />
                      <span className="text-xs font-semibold">{t.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* STEP 2: Monthly Allowance */}
              {step === 2 && (
                <div className="flex flex-col gap-6 items-center">
                  <div className="w-16 h-16 rounded-full bg-primary-fixed/10 border border-primary-fixed/30 flex items-center justify-center">
                    <BadgeIndianRupee className="w-8 h-8 text-primary-fixed" />
                  </div>
                  <div className="text-center">
                    <span className="font-display text-4xl font-bold text-white">₹{allowance.toLocaleString('en-IN')}</span>
                    <span className="text-xs text-[#849495] block mt-1">Expected monthly budget</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="50000"
                    step="1000"
                    value={allowance}
                    onChange={e => setAllowance(Number(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary-fixed"
                  />
                  <div className="flex justify-between w-full text-xs text-[#849495] font-mono">
                    <span>₹1,000</span>
                    <span>₹50,000</span>
                  </div>
                </div>
              )}

              {/* STEP 3: Income Source */}
              {step === 3 && (
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'parents', label: 'Parents / Allowance', icon: Wallet },
                    { id: 'freelancing', label: 'Freelancing', icon: Briefcase },
                    { id: 'internship', label: 'Internship Stipend', icon: Briefcase },
                    { id: 'part_time', label: 'Part-time Job', icon: Briefcase },
                    { id: 'scholarship', label: 'Scholarship', icon: Landmark },
                    { id: 'none', label: 'No regular income', icon: Wallet }
                  ].map(s => (
                    <button
                      key={s.id}
                      onClick={() => setIncomeSource(s.id)}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-center transition-all ${
                        incomeSource === s.id 
                          ? 'border-primary-fixed bg-primary-fixed/5 text-primary-fixed' 
                          : 'border-white/10 hover:border-white/20 text-[#b9caca]'
                      }`}
                    >
                      <s.icon className="w-5 h-5" />
                      <span className="text-xs font-semibold">{s.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* STEP 4: Active Loans */}
              {step === 4 && (
                <div className="flex flex-col gap-6">
                  <div className="flex justify-around">
                    <button
                      onClick={() => setHasLoan(false)}
                      className={`px-6 py-3 rounded-xl border text-sm font-semibold transition-all ${
                        !hasLoan ? 'border-primary-fixed bg-primary-fixed/5 text-primary-fixed' : 'border-white/10 text-[#b9caca]'
                      }`}
                    >
                      No Loans
                    </button>
                    <button
                      onClick={() => setHasLoan(true)}
                      className={`px-6 py-3 rounded-xl border text-sm font-semibold transition-all ${
                        hasLoan ? 'border-primary-fixed bg-primary-fixed/5 text-primary-fixed' : 'border-white/10 text-[#b9caca]'
                      }`}
                    >
                      I have active EMIs
                    </button>
                  </div>

                  {hasLoan && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="flex flex-col gap-4 border-t border-white/5 pt-4"
                    >
                      <div className="flex flex-col gap-1">
                        <label className="font-mono text-[9px] uppercase text-[#849495] tracking-wider">Lender Name</label>
                        <select 
                          value={lenderName} 
                          onChange={e => setLenderName(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-primary-fixed"
                        >
                          <option value="mPokket">mPokket</option>
                          <option value="Slice">Slice</option>
                          <option value="KreditBee">KreditBee</option>
                          <option value="Friend">Friend / Relative</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-mono text-[9px] uppercase text-[#849495] tracking-wider">Remaining Balance (₹)</label>
                        <input
                          type="number"
                          value={loanPrincipal}
                          onChange={e => setLoanPrincipal(Number(e.target.value))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-primary-fixed"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* STEP 5: SIP investments */}
              {step === 5 && (
                <div className="flex flex-col gap-6">
                  <div className="flex justify-around">
                    <button
                      onClick={() => setHasSip(false)}
                      className={`px-6 py-3 rounded-xl border text-sm font-semibold transition-all ${
                        !hasSip ? 'border-primary-fixed bg-primary-fixed/5 text-primary-fixed' : 'border-white/10 text-[#b9caca]'
                      }`}
                    >
                      No Investments
                    </button>
                    <button
                      onClick={() => setHasSip(true)}
                      className={`px-6 py-3 rounded-xl border text-sm font-semibold transition-all ${
                        hasSip ? 'border-primary-fixed bg-primary-fixed/5 text-primary-fixed' : 'border-white/10 text-[#b9caca]'
                      }`}
                    >
                      Yes, monthly SIP
                    </button>
                  </div>

                  {hasSip && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="flex flex-col gap-4 border-t border-white/5 pt-4"
                    >
                      <div className="flex flex-col gap-1">
                        <label className="font-mono text-[9px] uppercase text-[#849495] tracking-wider">Monthly SIP Amount (₹)</label>
                        <input
                          type="number"
                          value={sipAmount}
                          onChange={e => setSipAmount(Number(e.target.value))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-primary-fixed"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* STEP 6: Budgets */}
              {step === 6 && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[9px] uppercase text-[#849495] tracking-wider">Food & Dining Limit (₹)</label>
                    <input
                      type="number"
                      value={foodBudget}
                      onChange={e => setFoodBudget(Number(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-primary-fixed"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[9px] uppercase text-[#849495] tracking-wider">Travel / Commute Limit (₹)</label>
                    <input
                      type="number"
                      value={travelBudget}
                      onChange={e => setTravelBudget(Number(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-primary-fixed"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[9px] uppercase text-[#849495] tracking-wider">Shopping Limit (₹)</label>
                    <input
                      type="number"
                      value={shoppingBudget}
                      onChange={e => setShoppingBudget(Number(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-primary-fixed"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Navigation buttons inside card */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/5">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 py-2 rounded-xl border border-white/10 font-mono text-[10px] uppercase tracking-wider text-[#b9caca] hover:bg-white/5 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              ) : (
                <div />
              )}

              {step < 6 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="magnetic-btn px-6 py-2.5 rounded-xl font-mono text-[10px] uppercase tracking-wider font-bold flex items-center gap-1.5"
                >
                  Continue <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinish}
                  className="magnetic-btn px-6 py-2.5 rounded-xl font-mono text-[10px] uppercase tracking-wider font-bold flex items-center gap-1.5"
                >
                  Initialize System <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="h-8" />
    </div>
  );
}
