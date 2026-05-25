'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useFinanceStore } from '@/store/useFinanceStore';
import { supabase } from '@/lib/supabase';
import { 
  LayoutDashboard, History, Users, Map, Coins, 
  TrendingUp, PiggyBank, Target, CalendarClock, PieChart, 
  Calendar, Settings, Bell, LogOut, Sparkles, Menu, X, PlusCircle, AlertTriangle
} from 'lucide-react';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { init, user, setUser, isPreviewMode } = useFinanceStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStore = async () => {
      await init();
      setLoading(false);
    };
    loadStore();
  }, [init]);

  const handleLogout = async () => {
    if (!isPreviewMode && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    router.push('/login');
  };

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/transactions', label: 'Transactions', icon: History },
    { href: '/split', label: 'Split Expenses', icon: Users },
    { href: '/trips', label: 'Trips Module', icon: Map },
    { href: '/loans', label: 'Loan Sentinel', icon: Coins },
    { href: '/sips', label: 'SIP Vault', icon: TrendingUp },
    { href: '/budgets', label: 'Budgets', icon: PiggyBank },
    { href: '/goals', label: 'Goals', icon: Target },
    { href: '/reminders', label: 'Reminders', icon: CalendarClock },
    { href: '/analytics', label: 'Analytics', icon: PieChart },
    { href: '/calendar', label: 'Calendar View', icon: Calendar },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-sm font-mono uppercase tracking-widest text-[#849495] gap-4">
        <div className="w-10 h-10 border-2 border-primary-fixed border-t-transparent rounded-full animate-spin" />
        Syncing Telemetry...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-black text-[#e5e2e1] font-sans relative">
      
      {/* PREVIEW BANNER */}
      {isPreviewMode && (
        <div className="fixed top-0 left-0 w-full bg-yellow-500/10 border-b border-yellow-500/20 backdrop-blur-md z-[100] py-2 px-margin-mobile flex items-center justify-center gap-2 text-xs text-yellow-400 font-mono">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Preview Mode (Mock Data / Local Storage). Link your Supabase instance to enable full cloud sync.</span>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className={`hidden md:flex flex-col w-64 border-r border-white/5 bg-black/40 backdrop-blur-2xl shrink-0 p-6 ${isPreviewMode ? 'pt-28' : 'pt-24'} justify-between h-screen fixed top-0 left-0 z-40`}>
        <div className="flex flex-col gap-6 overflow-y-auto">
          {/* Logo / Brand */}
          <Link href="/dashboard" className="font-display text-primary-fixed text-2xl font-bold tracking-tighter brightness-125 select-none flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-fixed animate-pulse" />
            CapitalS
          </Link>

          {/* Quick Action Button */}
          <div className="flex flex-col gap-2">
            <Link 
              href="/transactions?action=add" 
              className="magnetic-btn w-full py-3 rounded-xl font-mono text-[10px] uppercase tracking-wider font-bold flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" /> Add Transaction
            </Link>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col gap-1.5">
            {navLinks.map(link => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
                    isActive 
                      ? 'bg-primary-fixed/5 border border-primary-fixed/20 text-primary-fixed' 
                      : 'border border-transparent text-[#b9caca]/80 hover:text-white hover:bg-white/3'
                  }`}
                >
                  <link.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-primary-fixed' : 'text-[#b9caca]'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Panel */}
        <div className="pt-6 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <img 
              src={user?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.name}`} 
              alt="Avatar" 
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 shrink-0" 
            />
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-semibold text-white truncate">{user?.name}</span>
              <span className="text-[10px] text-on-surface-variant font-mono truncate">{user?.email}</span>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            title="Log Out"
            className="p-2 rounded-lg border border-white/5 hover:border-red-500/30 hover:bg-red-500/5 text-on-surface-variant hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <header className={`md:hidden fixed top-0 left-0 w-full border-b border-white/5 bg-black/60 backdrop-blur-2xl z-40 px-margin-mobile flex justify-between items-center h-16 ${isPreviewMode ? 'mt-8' : ''}`}>
        <Link href="/dashboard" className="font-display text-primary-fixed text-xl font-bold tracking-tighter brightness-125 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-primary-fixed" />
          CapitalS
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/transactions?action=add" className="p-2 text-primary-fixed">
            <PlusCircle className="w-5 h-5" />
          </Link>
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 border border-white/5 rounded-lg text-[#b9caca]"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-black/80 backdrop-blur-md">
          <div className="w-64 border-r border-white/5 bg-black/90 p-6 flex flex-col justify-between h-full relative">
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-2 text-on-surface-variant"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col gap-6 overflow-y-auto mt-8">
              <Link 
                href="/dashboard" 
                onClick={() => setMobileMenuOpen(false)}
                className="font-display text-primary-fixed text-xl font-bold tracking-tighter brightness-125 flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-primary-fixed" />
                CapitalS
              </Link>
              
              <nav className="flex flex-col gap-1.5">
                {navLinks.map(link => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
                        isActive 
                          ? 'bg-primary-fixed/5 border border-primary-fixed/20 text-primary-fixed' 
                          : 'border border-transparent text-[#b9caca]/80 hover:text-white'
                      }`}
                    >
                      <link.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-primary-fixed' : 'text-[#b9caca]'}`} />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <img 
                  src={user?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.name}`} 
                  alt="Avatar" 
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10" 
                />
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs font-semibold text-white truncate">{user?.name}</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }} 
                className="p-2 text-on-surface-variant hover:text-red-400"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAGE WRAPPER */}
      <div className={`flex-grow md:pl-64 flex flex-col w-full ${isPreviewMode ? 'pt-8' : ''}`}>
        {/* DESKTOP HEADER (Subdued desktop header for notifications) */}
        <header className="hidden md:flex justify-end items-center h-20 px-margin-desktop border-b border-white/3 shrink-0 relative z-30 bg-black/10">
          <div className="flex items-center gap-6">
            {/* Notifications mock */}
            <button className="p-2 border border-white/5 rounded-xl text-[#b9caca] hover:text-white hover:border-white/15 transition-all relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary-fixed rounded-full shadow-[0_0_5px_#63f7ff]" />
            </button>
            
            {/* User widget */}
            <Link href="/settings" className="flex items-center gap-3 hover:opacity-85 transition-opacity">
              <span className="text-xs font-mono uppercase tracking-wider text-[#b9caca]">
                {user?.college || 'IIT Madras'}
              </span>
              <img 
                src={user?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.name}`} 
                alt="Avatar" 
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10" 
              />
            </Link>
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <main className="flex-grow p-6 md:p-margin-desktop relative z-20 overflow-y-auto mt-16 md:mt-0">
          {children}
        </main>
      </div>

    </div>
  );
}
