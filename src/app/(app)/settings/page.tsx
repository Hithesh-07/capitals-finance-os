'use client';

import React, { useState, useEffect } from 'react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { 
  User, Sparkles, Database, CheckCircle2, AlertTriangle, 
  Award, ShieldAlert, Zap, Flame, Trophy, Check, Save
} from 'lucide-react';

export default function SettingsPage() {
  const { user, setUser, isPreviewMode, savingsStreak, sips, expenses, sharedExpenses } = useFinanceStore();

  useEffect(() => {
    document.title = "Settings | CapitalS";
  }, []);

  const [name, setName] = useState(user?.name || '');
  const [college, setCollege] = useState(user?.college || '');
  const [city, setCity] = useState(user?.city || '');
  const [allowance, setAllowance] = useState(user?.monthly_allowance || 12000);
  const [studentType, setStudentType] = useState(user?.student_type || 'undergraduate');
  
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(false);

    try {
      const updatedUser = {
        ...user,
        name,
        college,
        city,
        monthly_allowance: Number(allowance),
        student_type: studentType
      } as any;

      setUser(updatedUser);

      // Write to Supabase if active
      if (!isPreviewMode && supabase) {
        await supabase
          .from('users')
          .update({
            name,
            college,
            city,
            monthly_allowance: Number(allowance),
            student_type: studentType
          })
          .eq('id', user?.id);
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  // Gamification Metrics
  const hasSipBadge = sips.length > 0;
  const hasSplitBadge = sharedExpenses.length > 0;
  const hasStreakBadge = savingsStreak >= 3;
  const hasImpulseBadge = !expenses.some(e => e.tag === 'impulse');

  const badges = [
    { 
      id: 'streak', 
      title: 'Frugality Pioneer', 
      desc: 'Active 3+ day no-spend streak', 
      earned: hasStreakBadge,
      icon: Flame,
      color: 'text-orange-400 border-orange-500/30 bg-orange-500/5'
    },
    { 
      id: 'sip', 
      title: 'Wealth Initiator', 
      desc: 'Registered a Groww/Zerodha SIP', 
      earned: hasSipBadge,
      icon: Trophy,
      color: 'text-primary-fixed border-primary-fixed/30 bg-primary-fixed/5'
    },
    { 
      id: 'split', 
      title: 'Split Commander', 
      desc: 'Logged a group split transaction', 
      earned: hasSplitBadge,
      icon: Zap,
      color: 'text-secondary border-secondary/30 bg-secondary/5'
    },
    { 
      id: 'impulse', 
      title: 'Impulse Shield', 
      desc: 'Zero impulse buys registered', 
      earned: hasImpulseBadge,
      icon: Award,
      color: 'text-tertiary-fixed border-tertiary-fixed/30 bg-tertiary-fixed/5'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-container-max mx-auto pb-12">
      
      {/* Title */}
      <div className="lg:col-span-12">
        <h1 className="font-display text-2xl md:text-4xl font-bold text-white tracking-tight">System Settings</h1>
        <p className="text-xs text-on-surface-variant font-mono uppercase mt-1">Profile configuration & badge vault</p>
      </div>

      {/* LEFT COLUMN: Profile editor (7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        
        {/* Profile Card */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
          <h3 className="font-display font-semibold text-white text-base flex items-center gap-1.5 border-b border-white/5 pb-3">
            <User className="w-5 h-5 text-primary-fixed" /> Personal Profile Metadata
          </h3>

          {savedSuccess && (
            <div className="p-3 rounded-xl border border-tertiary-fixed/20 bg-tertiary-fixed/5 text-xs text-tertiary-fixed flex items-center gap-2">
              <Check className="w-4 h-4" /> Profile updates registered in ledger.
            </div>
          )}

          <form onSubmit={handleProfileSave} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-primary-fixed"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Student Track</label>
                <select
                  value={studentType}
                  onChange={e => setStudentType(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-primary-fixed"
                >
                  <option value="school">School Student</option>
                  <option value="undergraduate">Undergraduate</option>
                  <option value="postgraduate">Postgraduate</option>
                  <option value="self_taught">Self-Taught</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">College Name</label>
                <input
                  type="text"
                  value={college}
                  onChange={e => setCollege(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-primary-fixed"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Current City</label>
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-primary-fixed"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Monthly pocket money (₹)</label>
                <input
                  type="number"
                  value={allowance}
                  onChange={e => setAllowance(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-primary-fixed"
                />
              </div>
            </div>

            <button
              type="submit"
              className="magnetic-btn px-6 py-3 rounded-xl font-mono text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-1.5 mt-2 self-start"
            >
              <Save className="w-4 h-4" /> Save Parameters
            </button>
          </form>
        </div>

        {/* Database syncing Status */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
          <h3 className="font-display font-semibold text-white text-base flex items-center gap-1.5 border-b border-white/5 pb-3">
            <Database className="w-5 h-5 text-primary-fixed" /> Supabase Connection Sentinel
          </h3>

          <div className="flex items-center gap-4">
            {isSupabaseConfigured ? (
              <>
                <div className="w-10 h-10 rounded-xl bg-tertiary-fixed/10 border border-tertiary-fixed/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-tertiary-fixed" />
                </div>
                <div className="flex flex-col text-xs">
                  <span className="font-semibold text-white">Status: Connected to Cloud DB</span>
                  <p className="text-on-surface-variant leading-relaxed mt-0.5">
                    Your financial telemetry is fully synchronized with public RLS-secured tables in Supabase.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="flex flex-col text-xs">
                  <span className="font-semibold text-white">Status: Local Preview Mode</span>
                  <p className="text-on-surface-variant leading-relaxed mt-0.5">
                    No active Supabase keys detected in `.env.local`. All logs are saved locally in this browser.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Badge Vault & Challenges (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        
        {/* Badge grid */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4">
          <h3 className="font-display font-semibold text-white text-base border-b border-white/5 pb-3 flex items-center justify-between">
            Achievements Badge Vault
            <span className="font-mono text-[9px] uppercase text-primary-fixed">compounding goals</span>
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {badges.map(b => (
              <div 
                key={b.id} 
                className={`p-4 rounded-xl border flex flex-col items-center text-center gap-2 transition-all ${
                  b.earned 
                    ? b.color 
                    : 'border-white/5 text-white/20 bg-black'
                }`}
              >
                <b.icon className={`w-8 h-8 ${b.earned ? '' : 'opacity-20'}`} />
                <span className={`text-xs font-semibold ${b.earned ? 'text-white' : 'text-white/25'}`}>{b.title}</span>
                <span className="text-[9px] text-[#849495] font-mono leading-tight">{b.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Challenges */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4">
          <h3 className="font-display font-semibold text-white text-sm">Active Savings Challenges</h3>
          
          <div className="flex flex-col gap-3 font-mono text-xs">
            <div className="p-3 rounded-xl border border-white/5 bg-white/2 flex flex-col gap-1.5">
              <span className="font-semibold text-white uppercase text-[9px]">Challenge 1: Zero Impulse Month</span>
              <p className="text-[10px] text-on-surface-variant leading-relaxed">
                Log zero transactions tagged as 'Impulse' this month to claim the Shield medal.
              </p>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-1">
                <div className={`h-full bg-primary-fixed ${hasImpulseBadge ? 'w-full' : 'w-0'}`} />
              </div>
            </div>

            <div className="p-3 rounded-xl border border-white/5 bg-white/2 flex flex-col gap-1.5">
              <span className="font-semibold text-white uppercase text-[9px]">Challenge 2: Compounding Starter</span>
              <p className="text-[10px] text-on-surface-variant leading-relaxed">
                Configure at least one active mutual fund SIP to unlock the Wealth medal.
              </p>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-1">
                <div className={`h-full bg-primary-fixed ${hasSipBadge ? 'w-full' : 'w-0'}`} />
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
