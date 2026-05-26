'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useFinanceStore } from '@/store/useFinanceStore';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { 
  LayoutDashboard, History, Users, Map, Coins, 
  TrendingUp, PiggyBank, Target, CalendarClock, PieChart, 
  Calendar, Settings, Bell, LogOut, Sparkles, Menu, X, PlusCircle, AlertTriangle,
  Moon, Flame, Percent, CreditCard
} from 'lucide-react';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { 
    init, user, setUser, isPreviewMode,
    expenses, reminders, loans, sips, savingsStreak, sharedExpenses, budgets,
    creditCards, creditCardBills
  } = useFinanceStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const notifications = React.useMemo(() => {
    if (!user) return [];

    const list = [];
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // 1. Spend Tracker / Nightly Spend Report
    const todaySpend = expenses
      .filter(e => e.date === todayStr)
      .reduce((sum, e) => sum + e.amount, 0);

    const currentHour = today.getHours();
    if (currentHour >= 21) {
      list.push({
        id: 'spend-report',
        type: 'spend_nightly',
        title: 'Nightly Spend Report',
        message: `Today's total spend is ₹${todaySpend.toLocaleString('en-IN')}. ${
          todaySpend === 0 
            ? "Amazing! A perfect no-spend day. 🌟" 
            : todaySpend > 5000 
            ? "High spending detected today. Try to limit non-essential expenses tomorrow." 
            : "Your spending today is within healthy limits. Keep it up!"
        }`,
        time: '9:00 PM Update',
        urgent: todaySpend > 5000,
      });
    } else {
      list.push({
        id: 'spend-report',
        type: 'spend_daily',
        title: 'Daily Spend Tracker',
        message: `You've spent ₹${todaySpend.toLocaleString('en-IN')} so far today.`,
        time: 'Live Update',
        urgent: false,
      });
    }

    // 2. Upcoming & Overdue Reminders
    const getDaysDifference = (d1Str: string, d2Str: string) => {
      const [y1, m1, d1] = d1Str.split('-').map(Number);
      const [y2, m2, d2] = d2Str.split('-').map(Number);
      const date1 = new Date(y1, m1 - 1, d1);
      const date2 = new Date(y2, m2 - 1, d2);
      const diffTime = date1.getTime() - date2.getTime();
      return Math.round(diffTime / (1000 * 60 * 60 * 24));
    };

    reminders.forEach(reminder => {
      if (reminder.status === 'paid') return;

      const diffDays = getDaysDifference(reminder.due_date, todayStr);
      const amountStr = reminder.amount !== undefined ? ` (₹${reminder.amount.toLocaleString('en-IN')})` : '';

      if (diffDays === 0) {
        list.push({
          id: `reminder-${reminder.id}`,
          type: 'reminder_today',
          title: 'Payment Due Today',
          message: `"${reminder.title}"${amountStr} is due today!`,
          time: 'Today',
          urgent: true,
        });
      } else if (diffDays === 1) {
        list.push({
          id: `reminder-${reminder.id}`,
          type: 'reminder_tomorrow',
          title: 'Payment Due Tomorrow',
          message: `"${reminder.title}"${amountStr} is due tomorrow.`,
          time: 'Tomorrow',
          urgent: false,
        });
      } else if (diffDays < 0) {
        list.push({
          id: `reminder-${reminder.id}`,
          type: 'reminder_overdue',
          title: 'Payment Overdue',
          message: `"${reminder.title}"${amountStr} was due ${Math.abs(diffDays)} day(s) ago!`,
          time: `${Math.abs(diffDays)}d ago`,
          urgent: true,
        });
      }
    });

    // 3. Overdue Loans
    loans.forEach(loan => {
      if (loan.status === 'overdue') {
        list.push({
          id: `loan-overdue-${loan.id}`,
          type: 'loan_overdue',
          title: 'Loan EMI Overdue',
          message: `Your EMI of ₹${loan.emi_amount.toLocaleString('en-IN')} for ${loan.lender_name} is overdue!`,
          time: 'Urgent',
          urgent: true,
        });
      }
    });

    // 4. Savings Streak
    if (savingsStreak > 0) {
      list.push({
        id: 'savings-streak',
        type: 'streak',
        title: 'Savings Streak Active',
        message: `You are on a ${savingsStreak}-day savings streak! Keep keeping those want/impulse spends away. 🚀`,
        time: 'Streak Status',
        urgent: false,
      });
    }

    // 5. Unsettled Shared Expenses
    sharedExpenses.forEach(se => {
      if (!se.settled) {
        const userOwes = se.split_between.includes(user.name);
        const userPaid = se.paid_by === user.name;
        if (userOwes || userPaid) {
          list.push({
            id: `split-${se.id}`,
            type: 'split_pending',
            title: 'Pending Split Settlement',
            message: `Split for "${se.description}" (₹${se.amount.toLocaleString('en-IN')}) is unsettled.`,
            time: 'Pending split',
            urgent: false,
          });
        }
      }
    });

    // 6. Budget Warnings
    const activeMonth = today.getMonth() + 1;
    const activeYear = today.getFullYear();
    budgets.forEach(b => {
      if (b.month === activeMonth && b.year === activeYear) {
        const spent = Number(b.spent);
        const limit = Number(b.monthly_limit);
        if (limit > 0) {
          const ratio = spent / limit;
          if (ratio >= 1.0) {
            list.push({
              id: `budget-exceeded-${b.id}`,
              type: 'budget_exceeded',
              title: 'Budget Limit Exceeded',
              message: `You have exceeded your ${b.category} budget (spent ₹${spent.toLocaleString('en-IN')} of ₹${limit.toLocaleString('en-IN')})!`,
              time: 'Budget Overrun',
              urgent: true,
            });
          } else if (ratio >= 0.8) {
            list.push({
              id: `budget-warning-${b.id}`,
              type: 'budget_warning',
              title: 'Budget Alert',
              message: `You have consumed ${(ratio * 100).toFixed(0)}% of your ${b.category} budget (₹${spent.toLocaleString('en-IN')} / ₹${limit.toLocaleString('en-IN')}).`,
              time: 'Budget Warning',
              urgent: false,
            });
          }
        }
      }
    });

    // 7. Credit Card Billing & Utilization Alerts
    creditCards.forEach(card => {
      const balance = Number(card.outstanding_balance);
      const limit = Number(card.card_limit);
      
      // A. Utilization Warnings
      if (limit > 0 && balance > 0) {
        const utilRatio = balance / limit;
        if (utilRatio >= 0.8) {
          list.push({
            id: `card-util-crit-${card.id}`,
            type: 'card_util_critical',
            title: 'Critical Card Limit',
            message: `${card.bank_name} ${card.card_name} limit is ${Math.round(utilRatio * 100)}% utilized (₹${balance.toLocaleString('en-IN')} / ₹${limit.toLocaleString('en-IN')})! Pay down balance immediately.`,
            time: 'CC Limit Alert',
            urgent: true,
          });
        } else if (utilRatio >= 0.3) {
          list.push({
            id: `card-util-warn-${card.id}`,
            type: 'card_util_warning',
            title: 'Card Limit Utilization',
            message: `${card.bank_name} ${card.card_name} is at ${Math.round(utilRatio * 100)}% utilization. Keeping utilization under 30% helps protect your credit score.`,
            time: 'CC Limit Alert',
            urgent: false,
          });
        }
      }

      // B. Payment Due Reminders
      if (balance > 0 && card.due_date) {
        const diffDays = getDaysDifference(card.due_date, todayStr);
        if (diffDays === 0) {
          list.push({
            id: `card-due-today-${card.id}`,
            type: 'reminder_today',
            title: 'Credit Card Bill Due',
            message: `Your bill of ₹${balance.toLocaleString('en-IN')} for ${card.bank_name} ${card.card_name} is due today!`,
            time: 'Today',
            urgent: true,
          });
        } else if (diffDays === 1) {
          list.push({
            id: `card-due-tom-${card.id}`,
            type: 'reminder_tomorrow',
            title: 'Credit Card Bill Tomorrow',
            message: `Your bill of ₹${balance.toLocaleString('en-IN')} for ${card.bank_name} ${card.card_name} is due tomorrow.`,
            time: 'Tomorrow',
            urgent: true,
          });
        } else if (diffDays < 0) {
          list.push({
            id: `card-due-overdue-${card.id}`,
            type: 'reminder_overdue',
            title: 'Credit Card Bill Overdue',
            message: `Your bill of ₹${balance.toLocaleString('en-IN')} for ${card.bank_name} ${card.card_name} was due ${Math.abs(diffDays)} day(s) ago!`,
            time: `${Math.abs(diffDays)}d ago`,
            urgent: true,
          });
        }
      }
    });

    return list;
  }, [user, expenses, reminders, loans, savingsStreak, sharedExpenses, budgets, creditCards]);

  const renderNotificationDropdown = (isMobile: boolean = false) => {
    return (
      <div className={`absolute ${isMobile ? 'right-[-70px] w-[290px]' : 'right-0 w-96'} mt-3 max-h-[450px] overflow-y-auto glass-panel rounded-2xl z-[100] p-4 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200`}>
        <div className="flex justify-between items-center border-b border-white/5 pb-2">
          <span className="font-display font-semibold text-white text-[11px] uppercase tracking-wider flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5 text-primary-fixed" /> Telemetry alerts ({notifications.length})
          </span>
          {notifications.length > 0 && (
            <span className="text-[9px] font-mono text-primary-fixed uppercase tracking-wider">
              Real-time updates
            </span>
          )}
        </div>
        
        {notifications.length === 0 ? (
          <div className="py-8 flex flex-col items-center justify-center gap-2 text-center">
            <Sparkles className="w-8 h-8 text-primary-fixed/40 animate-pulse" />
            <p className="text-[11px] font-mono uppercase text-[#b9caca] tracking-wide">All caught up! 🎉</p>
            <p className="text-[10px] text-on-surface-variant max-w-[200px] leading-relaxed">No pending payment alerts or budget triggers detected.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 divide-y divide-white/5 max-h-[350px] overflow-y-auto pr-1">
            {notifications.map(item => {
              let Icon = Bell;
              let iconColor = 'text-primary-fixed';
              let bgColor = 'bg-primary-fixed/5 border-primary-fixed/20';

              if (item.type === 'spend_nightly') {
                Icon = Moon;
                iconColor = 'text-[#dcb8ff]';
                bgColor = 'bg-[#dcb8ff]/5 border-[#dcb8ff]/20';
              } else if (item.type === 'spend_daily') {
                Icon = TrendingUp;
                iconColor = 'text-primary-fixed';
                bgColor = 'bg-primary-fixed/5 border-primary-fixed/20';
              } else if (item.type.startsWith('reminder_') || item.type === 'loan_overdue') {
                Icon = CalendarClock;
                if (item.urgent) {
                  iconColor = 'text-red-400';
                  bgColor = 'bg-red-500/5 border-red-500/20';
                } else {
                  iconColor = 'text-yellow-400';
                  bgColor = 'bg-yellow-500/5 border-yellow-500/20';
                }
              } else if (item.type === 'streak') {
                Icon = Flame;
                iconColor = 'text-orange-400';
                bgColor = 'bg-orange-500/5 border-orange-500/20';
              } else if (item.type === 'split_pending') {
                Icon = Users;
                iconColor = 'text-primary-fixed';
                bgColor = 'bg-primary-fixed/5 border-primary-fixed/20';
              } else if (item.type === 'budget_exceeded' || item.type === 'card_util_critical') {
                Icon = AlertTriangle;
                iconColor = 'text-red-400';
                bgColor = 'bg-red-500/5 border-red-500/20';
              } else if (item.type === 'budget_warning' || item.type === 'card_util_warning') {
                Icon = Percent;
                iconColor = 'text-yellow-400';
                bgColor = 'bg-yellow-500/5 border-yellow-500/20';
              }

              return (
                <div key={item.id} className={`p-3 rounded-xl border flex gap-3 text-xs leading-relaxed transition-all hover:bg-white/3 ${bgColor} pt-3 mt-1`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 bg-black/40 border-white/5`}>
                    <Icon className={`w-4 h-4 ${iconColor}`} />
                  </div>
                  <div className="flex flex-col gap-1 w-full overflow-hidden">
                    <div className="flex justify-between items-baseline gap-2">
                      <span className="font-semibold text-white truncate text-[11px] font-display">{item.title}</span>
                      <span className="text-[8px] font-mono uppercase tracking-wider text-on-surface-variant shrink-0">{item.time}</span>
                    </div>
                    <span className="text-[10px] text-on-surface-variant font-sans font-normal leading-normal whitespace-normal break-words">{item.message}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    const loadStore = async () => {
      await init();
      // If Supabase is configured but we have no logged-in user, redirect to login
      if (isSupabaseConfigured && !useFinanceStore.getState().user) {
        router.push('/login');
        return;
      }
      setLoading(false);
    };
    loadStore();
  }, [init, router]);

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
    { href: '/cards', label: 'Cards Sentinel', icon: CreditCard },
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
      
      {/* Click-outside overlay for notification center */}
      {notificationsOpen && (
        <div 
          className="fixed inset-0 z-40 bg-transparent cursor-default" 
          onClick={() => setNotificationsOpen(false)}
        />
      )}
      
      {/* PREVIEW BANNER — only show when Supabase is not configured */}
      {isPreviewMode && !isSupabaseConfigured && (
        <div className="fixed top-0 left-0 w-full bg-yellow-500/10 border-b border-yellow-500/20 backdrop-blur-md z-[100] py-2 px-margin-mobile flex items-center justify-center gap-2 text-xs text-yellow-400 font-mono">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Demo Mode — Configure your Supabase .env.local to enable full cloud sync.</span>
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
        <div className="flex items-center gap-2 relative">
          <div className="relative">
            <button 
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className={`p-2 border rounded-xl transition-all relative z-50 ${
                notificationsOpen 
                  ? 'border-primary-fixed/40 bg-primary-fixed/5 text-primary-fixed' 
                  : 'border-white/5 text-[#b9caca]'
              }`}
            >
              <Bell className="w-4 h-4" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              )}
            </button>
            {notificationsOpen && renderNotificationDropdown(true)}
          </div>
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
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className={`p-2 border rounded-xl transition-all relative z-50 ${
                  notificationsOpen 
                    ? 'border-primary-fixed/40 bg-primary-fixed/5 text-primary-fixed' 
                    : 'border-white/5 text-[#b9caca] hover:text-white hover:border-white/15'
                }`}
              >
                <Bell className="w-4 h-4" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                )}
              </button>
              {notificationsOpen && renderNotificationDropdown(false)}
            </div>
            
            {/* User widget */}
            <Link href="/settings" className="flex items-center gap-3 hover:opacity-85 transition-opacity">
              <span className="text-xs font-mono uppercase tracking-wider text-[#b9caca]">
                {user?.name || user?.email?.split('@')[0] || 'CapitalS'}
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
