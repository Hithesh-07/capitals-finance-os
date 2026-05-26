import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// ====================================================
// TYPES & INTERFACES
// ====================================================

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  college?: string;
  city?: string;
  student_type?: string;
  currency: string;
  monthly_allowance: number;
  main_income_source?: string;
  has_loan?: boolean;
  has_sip?: boolean;
  financial_goal?: string;
  preferred_reminder_time?: string;
  avatar_url?: string;
  created_at?: string;
}

export interface Income {
  id: string;
  user_id: string;
  amount: number;
  source: string;
  date: string;
  note?: string;
  payment_mode?: string;
  is_recurring?: boolean;
  frequency?: string;
  client_name?: string;
  expected_payout_date?: string;
  created_at?: string;
}

export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  category: string;
  subcategory?: string;
  date: string;
  note?: string;
  payment_mode?: string;
  venue_name?: string;
  tag?: 'need' | 'want' | 'impulse';
  trip_id?: string;
  linked_loan_id?: string;
  linked_credit_card_id?: string;
  is_recurring?: boolean;
  frequency?: string;
  receipt_url?: string;
  location?: string;
  people_count?: number;
  created_at?: string;
}

export interface Trip {
  id: string;
  user_id: string;
  name: string;
  destination?: string;
  start_date?: string;
  end_date?: string;
  total_budget: number;
  participants: string[];
  cover_image?: string;
  notes?: string;
  status: 'planned' | 'active' | 'completed';
  created_at?: string;
}

export interface TripExpense {
  id: string;
  trip_id: string;
  user_id: string;
  amount: number;
  category: string;
  subcategory?: string;
  description?: string;
  paid_by: string;
  split_between: string[];
  date: string;
}

export interface Loan {
  id: string;
  user_id: string;
  lender_name: string;
  loan_type?: string;
  principal: number;
  interest_rate: number;
  emi_amount: number;
  start_date: string;
  due_date: string;
  total_paid: number;
  remaining_balance: number;
  status: 'active' | 'paid' | 'overdue';
  notes?: string;
  created_at?: string;
}

export interface Sip {
  id: string;
  user_id: string;
  fund_name: string;
  fund_type?: string;
  monthly_amount: number;
  start_date: string;
  next_payment_date: string;
  total_invested: number;
  current_value: number;
  reminder_days_before: number;
  status: 'active' | 'paused' | 'inactive';
  linked_goal_id?: string;
  created_at?: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category: string;
  monthly_limit: number;
  spent: number;
  month: number;
  year: number;
  rollover_enabled?: boolean;
  created_at?: string;
}

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  saved_amount: number;
  deadline?: string;
  monthly_contribution?: number;
  category?: string;
  status: 'in_progress' | 'achieved' | 'paused';
  icon?: string;
  created_at?: string;
}

export interface Reminder {
  id: string;
  user_id: string;
  title: string;
  amount?: number;
  due_date: string;
  frequency?: string;
  type: 'sip' | 'loan' | 'subscription' | 'rent' | 'recharge' | 'exam_fee' | 'custom';
  status: 'pending' | 'paid' | 'snoozed' | 'overdue';
  reminder_time?: string;
  autopay?: boolean;
  created_at?: string;
}

export interface Friend {
  id: string;
  user_id: string;
  friend_name: string;
  phone?: string;
  upi_id?: string;
  created_at?: string;
}

export interface SharedExpense {
  id: string;
  user_id: string;
  paid_by: string;
  amount: number;
  description: string;
  split_between: string[];
  trip_id?: string;
  date: string;
  settled: boolean;
  created_at?: string;
}

export interface Settlement {
  id: string;
  shared_expense_id: string;
  from_user: string;
  to_user: string;
  amount: number;
  settled_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  renewal_date: string;
  frequency: string;
  category?: string;
  logo_url?: string;
  shared_with?: string[];
  split_ratio?: number[];
  status: 'active' | 'paused' | 'cancelled';
  created_at?: string;
}

export interface AiInsight {
  id: string;
  user_id: string;
  message: string;
  type: 'info' | 'warning' | 'safety' | 'achievement';
  generated_at?: string;
  dismissed: boolean;
}

export interface CreditCard {
  id: string;
  user_id: string;
  card_name: string;
  bank_name: string;
  card_limit: number;
  outstanding_balance: number;
  due_date: string;
  statement_date: string;
  card_network: string;
  card_theme: string;
  created_at?: string;
}

export interface CreditCardBill {
  id: string;
  card_id: string;
  user_id: string;
  bill_amount: number;
  due_date: string;
  status: 'paid' | 'unpaid';
  created_at?: string;
}

// ====================================================
// STORE STATE INTERFACE
// ====================================================

interface FinanceState {
  isPreviewMode: boolean;
  user: UserProfile | null;
  incomes: Income[];
  expenses: Expense[];
  trips: Trip[];
  tripExpenses: TripExpense[];
  loans: Loan[];
  sips: Sip[];
  budgets: Budget[];
  goals: Goal[];
  reminders: Reminder[];
  friends: Friend[];
  sharedExpenses: SharedExpense[];
  settlements: Settlement[];
  subscriptions: Subscription[];
  insights: AiInsight[];
  savingsStreak: number;
  noSpendDays: string[]; // ISO date strings
  creditCards: CreditCard[];
  creditCardBills: CreditCardBill[];

  // Core Actions
  init: () => Promise<void>;
  setUser: (user: UserProfile | null) => void;
  
  // Mutations
  addIncome: (amount: number, source: string, note?: string, paymentMode?: string, isRecurring?: boolean, frequency?: string, clientName?: string, expectedPayoutDate?: string, date?: string) => Promise<void>;
  addExpense: (amount: number, category: string, subcategory?: string, note?: string, paymentMode?: string, venueName?: string, tag?: 'need' | 'want' | 'impulse', tripId?: string, linkedLoanId?: string, date?: string, linkedCreditCardId?: string) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  deleteIncome: (id: string) => Promise<void>;
  editExpense: (id: string, amount: number, category: string, note: string, paymentMode: string, date: string, tag: 'need' | 'want' | 'impulse') => Promise<void>;
  addCreditCard: (cardName: string, bankName: string, cardLimit: number, dueDate: string, statementDate: string, cardNetwork: string, cardTheme?: string) => Promise<void>;
  deleteCreditCard: (cardId: string) => Promise<void>;
  payCardBill: (cardId: string, amount: number) => Promise<void>;
  editIncome: (id: string, amount: number, source: string, note: string, paymentMode: string, date: string) => Promise<void>;
  addTrip: (name: string, destination?: string, startDate?: string, endDate?: string, totalBudget?: number, participants?: string[]) => Promise<void>;
  addTripExpense: (tripId: string, amount: number, category: string, description: string, paidBy: string, splitBetween: string[]) => Promise<void>;
  addLoan: (lenderName: string, principal: number, interestRate: number, emiAmount: number, startDate: string, dueDate: string, loanType?: string) => Promise<void>;
  deleteLoan: (loanId: string) => Promise<void>;
  payLoanEmi: (loanId: string, emiAmount: number) => Promise<void>;
  addSip: (fundName: string, monthlyAmount: number, startDate: string, nextPaymentDate: string, fundType?: string, linkedGoalId?: string) => Promise<void>;
  deleteSip: (sipId: string) => Promise<void>;
  updateSipValue: (sipId: string, currentVal: number) => Promise<void>;
  addBudget: (category: string, limit: number, month: number, year: number, rollover?: boolean) => Promise<void>;
  addGoal: (name: string, targetAmount: number, deadline?: string, contribution?: number, category?: string, icon?: string) => Promise<void>;
  contributeToGoal: (goalId: string, amount: number) => Promise<void>;
  addReminder: (title: string, amount: number | undefined, dueDate: string, type: Reminder['type'], reminderTime?: string, autopay?: boolean) => Promise<void>;
  markReminderPaid: (reminderId: string) => Promise<void>;
  deleteReminder: (reminderId: string) => Promise<void>;
  addFriend: (name: string, phone?: string, upiId?: string) => Promise<void>;
  deleteFriend: (friendId: string) => Promise<void>;
  addSharedExpense: (paidBy: string, amount: number, description: string, splitBetween: string[], tripId?: string) => Promise<void>;
  settleSplitBill: (sharedExpenseId: string, fromUser: string, toUser: string, amount: number) => Promise<void>;
  addSubscription: (name: string, amount: number, renewalDate: string, frequency: string, category?: string, sharedWith?: string[], splitRatio?: number[]) => Promise<void>;
  dismissInsight: (insightId: string) => Promise<void>;
  
  // Brokeman calculations
  getBrokemanTelemetry: () => {
    totalBalance: number;
    daysRemainingInMonth: number;
    dailyDisposableRunway: number;
    burnRate7D: number;
    runwayDays: number;
    exhaustionDate: string;
    isCritical: boolean;
  };
}

// ====================================================
// HELPERS
// ====================================================

/**
 * Compute logging streak = consecutive days (going backwards from today)
 * where the user logged at least one expense or income.
 * If today has a log entry it counts. The streak breaks as soon as a day
 * with zero entries is encountered.
 */
function computeSavingsStreak(expenses: Expense[], incomes: Income[]): number {
  // Build a Set of all dates that have at least one log entry
  const loggedDays = new Set<string>();
  expenses.forEach(e => loggedDays.add(e.date.split('T')[0]));
  incomes.forEach(i => loggedDays.add(i.date.split('T')[0]));

  if (loggedDays.size === 0) return 0;

  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  // Walk backwards from today; stop as soon as a day has no entry
  for (let i = 0; i < 3650; i++) {
    const dateStr = cursor.toISOString().split('T')[0];
    if (!loggedDays.has(dateStr)) break;
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

// ====================================================
// IMPLEMENTATION
// ====================================================

export const useFinanceStore = create<FinanceState>((set, get) => ({
  isPreviewMode: true,
  user: null,
  incomes: [],
  expenses: [],
  trips: [],
  tripExpenses: [],
  loans: [],
  sips: [],
  budgets: [],
  goals: [],
  reminders: [],
  friends: [],
  sharedExpenses: [],
  settlements: [],
  subscriptions: [],
  insights: [],
  savingsStreak: 0,
  noSpendDays: [],
  creditCards: [],
  creditCardBills: [],

  init: async () => {
    // 1. If Supabase is active, session is the single source of truth
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const userId = session.user.id;
          
          // Fetch user profile
          let { data: userProfile } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

          if (!userProfile) {
            // Profile doesn't exist in public.users yet (e.g. signup trigger was delayed or manual onboarding)
            // Auto-create/upsert the profile row so the user isn't orphaned
            const newProfile = {
              id: userId,
              name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Student User',
              email: session.user.email || '',
              currency: 'INR',
              monthly_allowance: 10000,
              student_type: 'undergraduate',
              main_income_source: 'parents'
            };
            const { data: insertedProfile, error: insertError } = await supabase
              .from('users')
              .upsert(newProfile)
              .select('*')
              .single();
            
            if (!insertError && insertedProfile) {
              userProfile = insertedProfile;
            } else {
              console.error("Failed to auto-create user profile", insertError);
              userProfile = newProfile;
            }
          }

          // Fetch all user data tables from Supabase
          const [
            incRes, expRes, tripRes, tripExpRes, loanRes,
            sipRes, budRes, goalRes, remRes, friendRes,
            sharedRes, settRes, subRes, insRes, ccRes, ccBillRes
          ] = await Promise.all([
            supabase.from('income').select('*').eq('user_id', userId),
            supabase.from('expenses').select('*').eq('user_id', userId),
            supabase.from('trips').select('*').eq('user_id', userId),
            supabase.from('trip_expenses').select('*').eq('user_id', userId),
            supabase.from('loans').select('*').eq('user_id', userId),
            supabase.from('sips').select('*').eq('user_id', userId),
            supabase.from('budgets').select('*').eq('user_id', userId),
            supabase.from('goals').select('*').eq('user_id', userId),
            supabase.from('reminders').select('*').eq('user_id', userId),
            supabase.from('friends').select('*').eq('user_id', userId),
            supabase.from('shared_expenses').select('*').eq('user_id', userId),
            supabase.from('settlements').select('*, shared_expenses!inner(user_id)').eq('shared_expenses.user_id', userId),
            supabase.from('subscriptions').select('*').eq('user_id', userId),
            supabase.from('ai_insights').select('*').eq('user_id', userId).eq('dismissed', false),
            supabase.from('credit_cards').select('*').eq('user_id', userId),
            supabase.from('credit_card_bills').select('*').eq('user_id', userId),
          ]);

          const loadedExpenses = expRes.data || [];
          const loadedIncomes = incRes.data || [];
          set({
            isPreviewMode: false,
            user: userProfile,
            incomes: loadedIncomes,
            expenses: loadedExpenses,
            trips: tripRes.data || [],
            tripExpenses: tripExpRes.data || [],
            loans: loanRes.data || [],
            sips: sipRes.data || [],
            budgets: budRes.data || [],
            goals: goalRes.data || [],
            reminders: remRes.data || [],
            friends: friendRes.data || [],
            sharedExpenses: sharedRes.data || [],
            settlements: settRes.data || [],
            subscriptions: subRes.data || [],
            insights: insRes.data || [],
            creditCards: ccRes.data || [],
            creditCardBills: ccBillRes.data || [],
            savingsStreak: computeSavingsStreak(loadedExpenses, loadedIncomes),
          });
          return;
        } else {
          // No live session, but Supabase is configured -> Clear state so user is redirected to login
          set({
            isPreviewMode: false,
            user: null,
            incomes: [],
            expenses: [],
            trips: [],
            tripExpenses: [],
            loans: [],
            sips: [],
            budgets: [],
            goals: [],
            reminders: [],
            friends: [],
            sharedExpenses: [],
            settlements: [],
            subscriptions: [],
            insights: [],
            savingsStreak: 0,
            noSpendDays: [],
            creditCards: [],
            creditCardBills: [],
          });
          return;
        }
      } catch (err) {
        console.error("Failed to initialize Supabase session", err);
      }
    }

    // 2. If Supabase is NOT active, load from localStorage (Mock / Demo mode)
    const localData = localStorage.getItem('capitals_local_data_v1');
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        if (parsed.user && parsed.user.id) {
          const localExpenses: Expense[] = parsed.expenses || [];
          const localIncomes: Income[] = parsed.incomes || [];
          set({
            isPreviewMode: true,
            user: parsed.user,
            incomes: localIncomes,
            expenses: localExpenses,
            trips: parsed.trips || [],
            tripExpenses: parsed.tripExpenses || [],
            loans: parsed.loans || [],
            sips: parsed.sips || [],
            budgets: parsed.budgets || [],
            goals: parsed.goals || [],
            reminders: parsed.reminders || [],
            friends: parsed.friends || [],
            sharedExpenses: parsed.sharedExpenses || [],
            settlements: parsed.settlements || [],
            subscriptions: parsed.subscriptions || [],
            insights: parsed.insights || [],
            savingsStreak: computeSavingsStreak(localExpenses, localIncomes),
            noSpendDays: parsed.noSpendDays || [],
            creditCards: parsed.creditCards || [],
            creditCardBills: parsed.creditCardBills || [],
          });
          return;
        }
      } catch (e) {
        console.error("Failed parsing local storage", e);
      }
    }

    // Completely fresh empty state (No Supabase, No LocalData)
    localStorage.removeItem('capitals_local_data_v1');
    set({
      isPreviewMode: true,
      user: null,
      incomes: [],
      expenses: [],
      trips: [],
      tripExpenses: [],
      loans: [],
      sips: [],
      budgets: [],
      goals: [],
      reminders: [],
      friends: [],
      sharedExpenses: [],
      settlements: [],
      subscriptions: [],
      insights: [],
      savingsStreak: 0,
      noSpendDays: [],
      creditCards: [],
      creditCardBills: [],
    });
  },

  setUser: (user) => {
    set({ user });
    if (get().isPreviewMode) {
      const currentLocal = JSON.parse(localStorage.getItem('capitals_local_data_v1') || '{}');
      localStorage.setItem('capitals_local_data_v1', JSON.stringify({ ...currentLocal, user }));
    }
  },

  // ====================================================
  // ADD INCOME
  // ====================================================
  addIncome: async (amount, source, note, paymentMode, isRecurring, frequency, clientName, expectedPayoutDate, date) => {
    const { user, isPreviewMode, incomes } = get();
    const incomeDate = date || new Date().toISOString().split('T')[0];

    // Always get userId from the live auth session so it matches RLS auth.uid()
    let currentUserId = user?.id || 'user-mock-123';
    if (!isPreviewMode && supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) currentUserId = session.user.id;
    }

    const newIncome: Income = {
      id: `inc-${Math.random().toString(36).substr(2, 9)}`,
      user_id: currentUserId,
      amount,
      source,
      date: incomeDate,
      note,
      payment_mode: paymentMode || 'UPI',
      is_recurring: isRecurring,
      frequency,
      client_name: clientName,
      expected_payout_date: expectedPayoutDate,
      created_at: new Date().toISOString()
    };

    if (!isPreviewMode && supabase) {
      const { error } = await supabase.from('income').insert({
        amount,
        source,
        note,
        date: incomeDate,
        payment_mode: paymentMode,
        is_recurring: isRecurring,
        frequency,
        client_name: clientName,
        expected_payout_date: expectedPayoutDate,
        user_id: currentUserId
      });
      if (error) throw error;
      // Reload from DB
      await get().init();
    } else {
      const updated = [newIncome, ...incomes];
      set({ incomes: updated });
      const currentLocal = JSON.parse(localStorage.getItem('capitals_local_data_v1') || '{}');
      localStorage.setItem('capitals_local_data_v1', JSON.stringify({ ...currentLocal, incomes: updated }));
    }
  },

  // ====================================================
  // ADD EXPENSE (WITH BUDGET TRACKING)
  // ====================================================
  addExpense: async (amount, category, subcategory, note, paymentMode, venueName, tag, tripId, linkedLoanId, date, linkedCreditCardId) => {
    const { user, isPreviewMode, expenses, budgets, noSpendDays, savingsStreak } = get();
    const expenseDate = date || new Date().toISOString().split('T')[0];

    // Always get userId from the live auth session so it matches RLS auth.uid()
    let currentUserId = user?.id || 'user-mock-123';
    if (!isPreviewMode && supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) currentUserId = session.user.id;
    }

    const newExpense: Expense = {
      id: `exp-${Math.random().toString(36).substr(2, 9)}`,
      user_id: currentUserId,
      amount,
      category,
      subcategory,
      date: expenseDate,
      note,
      payment_mode: paymentMode || 'UPI',
      venue_name: venueName,
      tag: tag || 'need',
      trip_id: tripId,
      linked_loan_id: linkedLoanId,
      linked_credit_card_id: linkedCreditCardId,
      created_at: new Date().toISOString()
    };

    // Calculate budgets update locally
    const today = new Date();
    const m = today.getMonth() + 1;
    const y = today.getFullYear();
    const updatedBudgets = budgets.map(b => {
      if (b.category === category && b.month === m && b.year === y) {
        return { ...b, spent: Number(b.spent) + amount };
      }
      return b;
    });

    // Handle savings streak calculations (adding an expense breaks a "no spend day" if it's not a need category)
    let newStreak = savingsStreak;
    const todayStr = today.toISOString().split('T')[0];
    let updatedNoSpend = [...noSpendDays];
    
    if (tag === 'impulse' || tag === 'want') {
      // Break streak
      newStreak = 0;
      updatedNoSpend = noSpendDays.filter(d => d !== todayStr);
    }

    if (!isPreviewMode && supabase) {
      // Update Expense in DB
      const { error } = await supabase.from('expenses').insert({
        amount,
        category,
        subcategory,
        note,
        date: expenseDate,
        payment_mode: paymentMode,
        venue_name: venueName,
        tag,
        trip_id: tripId,
        linked_loan_id: linkedLoanId,
        linked_credit_card_id: linkedCreditCardId,
        user_id: currentUserId
      });
      if (error) throw error;
      
      // Update Credit Card outstanding balance in DB
      if (linkedCreditCardId) {
        const card = get().creditCards.find(c => c.id === linkedCreditCardId);
        if (card) {
          await supabase
            .from('credit_cards')
            .update({ outstanding_balance: Number(card.outstanding_balance) + amount })
            .eq('id', linkedCreditCardId);
        }
      }

      // Update Budget spent in DB
      const currentBud = budgets.find(b => b.category === category && b.month === m && b.year === y);
      if (currentBud) {
        await supabase
          .from('budgets')
          .update({ spent: Number(currentBud.spent) + amount })
          .eq('id', currentBud.id);
      }

      await get().init();
    } else {
      let updatedCards = get().creditCards;
      if (linkedCreditCardId) {
        updatedCards = updatedCards.map(c => {
          if (c.id === linkedCreditCardId) {
            return { ...c, outstanding_balance: Number(c.outstanding_balance) + amount };
          }
          return c;
        });
      }

      const updatedExpenses = [newExpense, ...expenses];
      set({ 
        expenses: updatedExpenses, 
        budgets: updatedBudgets,
        savingsStreak: newStreak,
        noSpendDays: updatedNoSpend,
        creditCards: updatedCards
      });
      const currentLocal = JSON.parse(localStorage.getItem('capitals_local_data_v1') || '{}');
      localStorage.setItem('capitals_local_data_v1', JSON.stringify({ 
        ...currentLocal, 
        expenses: updatedExpenses,
        budgets: updatedBudgets,
        savingsStreak: newStreak,
        noSpendDays: updatedNoSpend,
        creditCards: updatedCards
      }));
    }
  },

  deleteExpense: async (id) => {
    const { isPreviewMode, expenses, budgets } = get();
    const exp = expenses.find(e => e.id === id);
    if (!exp) return;

    // Adjust budgets
    const expDate = new Date(exp.date);
    const m = expDate.getMonth() + 1;
    const y = expDate.getFullYear();
    const updatedBudgets = budgets.map(b => {
      if (b.category === exp.category && b.month === m && b.year === y) {
        return { ...b, spent: Math.max(0, Number(b.spent) - exp.amount) };
      }
      return b;
    });

    if (!isPreviewMode && supabase) {
      if (exp.linked_credit_card_id) {
        const card = get().creditCards.find(c => c.id === exp.linked_credit_card_id);
        if (card) {
          await supabase
            .from('credit_cards')
            .update({ outstanding_balance: Math.max(0, Number(card.outstanding_balance) - exp.amount) })
            .eq('id', exp.linked_credit_card_id);
        }
      }

      await supabase.from('expenses').delete().eq('id', id);
      const currentBud = budgets.find(b => b.category === exp.category && b.month === m && b.year === y);
      if (currentBud) {
        await supabase
          .from('budgets')
          .update({ spent: Math.max(0, Number(currentBud.spent) - exp.amount) })
          .eq('id', currentBud.id);
      }
      await get().init();
    } else {
      let updatedCards = get().creditCards;
      if (exp.linked_credit_card_id) {
        updatedCards = updatedCards.map(c => {
          if (c.id === exp.linked_credit_card_id) {
            return { ...c, outstanding_balance: Math.max(0, Number(c.outstanding_balance) - exp.amount) };
          }
          return c;
        });
      }

      const updatedExpenses = expenses.filter(e => e.id !== id);
      set({ expenses: updatedExpenses, budgets: updatedBudgets, creditCards: updatedCards });
      const currentLocal = JSON.parse(localStorage.getItem('capitals_local_data_v1') || '{}');
      localStorage.setItem('capitals_local_data_v1', JSON.stringify({ 
        ...currentLocal, 
        expenses: updatedExpenses, 
        budgets: updatedBudgets,
        creditCards: updatedCards
      }));
    }
  },

  deleteIncome: async (id) => {
    const { isPreviewMode, incomes } = get();
    if (!isPreviewMode && supabase) {
      await supabase.from('income').delete().eq('id', id);
      await get().init();
    } else {
      const updatedIncomes = incomes.filter(i => i.id !== id);
      set({ incomes: updatedIncomes });
      const currentLocal = JSON.parse(localStorage.getItem('capitals_local_data_v1') || '{}');
      localStorage.setItem('capitals_local_data_v1', JSON.stringify({ ...currentLocal, incomes: updatedIncomes }));
    }
  },

  editExpense: async (id, amount, category, note, paymentMode, date, tag) => {
    const { isPreviewMode, expenses, budgets } = get();
    const exp = expenses.find(e => e.id === id);
    if (!exp) return;

    const oldDate = new Date(exp.date);
    const oldM = oldDate.getMonth() + 1;
    const oldY = oldDate.getFullYear();

    const newDate = new Date(date);
    const newM = newDate.getMonth() + 1;
    const newY = newDate.getFullYear();

    let updatedBudgets = [...budgets];
    updatedBudgets = updatedBudgets.map(b => {
      if (b.category === exp.category && b.month === oldM && b.year === oldY) {
        return { ...b, spent: Math.max(0, Number(b.spent) - exp.amount) };
      }
      return b;
    });
    updatedBudgets = updatedBudgets.map(b => {
      if (b.category === category && b.month === newM && b.year === newY) {
        return { ...b, spent: Number(b.spent) + amount };
      }
      return b;
    });

    if (!isPreviewMode && supabase) {
      await supabase
        .from('expenses')
        .update({
          amount,
          category,
          note,
          date,
          payment_mode: paymentMode,
          tag
        })
        .eq('id', id);

      const oldBud = budgets.find(b => b.category === exp.category && b.month === oldM && b.year === oldY);
      if (oldBud) {
        await supabase
          .from('budgets')
          .update({ spent: Math.max(0, Number(oldBud.spent) - exp.amount) })
          .eq('id', oldBud.id);
      }
      const newBud = budgets.find(b => b.category === category && b.month === newM && b.year === newY);
      if (newBud) {
        await supabase
          .from('budgets')
          .update({ spent: Number(newBud.spent) + amount })
          .eq('id', newBud.id);
      }
      await get().init();
    } else {
      const updatedExpenses = expenses.map(e => {
        if (e.id === id) {
          return { ...e, amount, category, note, date, payment_mode: paymentMode, tag };
        }
        return e;
      });
      set({ expenses: updatedExpenses, budgets: updatedBudgets });
      const currentLocal = JSON.parse(localStorage.getItem('capitals_local_data_v1') || '{}');
      localStorage.setItem('capitals_local_data_v1', JSON.stringify({ 
        ...currentLocal, 
        expenses: updatedExpenses, 
        budgets: updatedBudgets 
      }));
    }
  },

  editIncome: async (id, amount, source, note, paymentMode, date) => {
    const { isPreviewMode, incomes } = get();
    const inc = incomes.find(i => i.id === id);
    if (!inc) return;

    if (!isPreviewMode && supabase) {
      await supabase
        .from('income')
        .update({
          amount,
          source,
          note,
          date,
          payment_mode: paymentMode
        })
        .eq('id', id);
      await get().init();
    } else {
      const updatedIncomes = incomes.map(i => {
        if (i.id === id) {
          return { ...i, amount, source, note, date, payment_mode: paymentMode };
        }
        return i;
      });
      set({ incomes: updatedIncomes });
      const currentLocal = JSON.parse(localStorage.getItem('capitals_local_data_v1') || '{}');
      localStorage.setItem('capitals_local_data_v1', JSON.stringify({ ...currentLocal, incomes: updatedIncomes }));
    }
  },

  // ====================================================
  // TRIPS & TRIP EXPENSES
  // ====================================================
  addTrip: async (name, destination, startDate, endDate, totalBudget, participants) => {
    const { isPreviewMode, user, trips } = get();
    const currentUserId = user?.id || 'user-mock-123';

    const newTrip: Trip = {
      id: `trip-${Math.random().toString(36).substr(2, 9)}`,
      user_id: currentUserId,
      name,
      destination,
      start_date: startDate,
      end_date: endDate,
      total_budget: totalBudget || 0,
      participants: participants || [],
      status: 'planned',
      created_at: new Date().toISOString()
    };

    if (!isPreviewMode && supabase) {
      await supabase.from('trips').insert({
        name,
        destination,
        start_date: startDate,
        end_date: endDate,
        total_budget: totalBudget || 0,
        participants: participants || [],
        user_id: currentUserId
      });
      await get().init();
    } else {
      const updated = [newTrip, ...trips];
      set({ trips: updated });
      const currentLocal = JSON.parse(localStorage.getItem('capitals_local_data_v1') || '{}');
      localStorage.setItem('capitals_local_data_v1', JSON.stringify({ ...currentLocal, trips: updated }));
    }
  },

  addTripExpense: async (tripId, amount, category, description, paidBy, splitBetween) => {
    const { isPreviewMode, user, tripExpenses } = get();
    const currentUserId = user?.id || 'user-mock-123';

    const newTripExp: TripExpense = {
      id: `tr-exp-${Math.random().toString(36).substr(2, 9)}`,
      trip_id: tripId,
      user_id: currentUserId,
      amount,
      category,
      description,
      paid_by: paidBy,
      split_between: splitBetween,
      date: new Date().toISOString().split('T')[0]
    };

    if (!isPreviewMode && supabase) {
      await supabase.from('trip_expenses').insert({
        trip_id: tripId,
        amount,
        category,
        description,
        paid_by: paidBy,
        split_between: splitBetween,
        user_id: currentUserId
      });
      await get().init();
    } else {
      const updated = [newTripExp, ...tripExpenses];
      set({ tripExpenses: updated });
      const currentLocal = JSON.parse(localStorage.getItem('capitals_local_data_v1') || '{}');
      localStorage.setItem('capitals_local_data_v1', JSON.stringify({ ...currentLocal, tripExpenses: updated }));
    }
  },

  // ====================================================
  // LOAN SENTINEL
  // ====================================================
  addLoan: async (lenderName, principal, interestRate, emiAmount, startDate, dueDate, loanType) => {
    const { isPreviewMode, user, loans } = get();
    const currentUserId = user?.id || 'user-mock-123';

    const newLoan: Loan = {
      id: `loan-${Math.random().toString(36).substr(2, 9)}`,
      user_id: currentUserId,
      lender_name: lenderName,
      loan_type: loanType || 'app',
      principal,
      interest_rate: interestRate,
      emi_amount: emiAmount,
      start_date: startDate,
      due_date: dueDate,
      total_paid: 0,
      remaining_balance: principal,
      status: 'active',
      created_at: new Date().toISOString()
    };

    if (!isPreviewMode && supabase) {
      await supabase.from('loans').insert({
        lender_name: lenderName,
        principal,
        interest_rate: interestRate,
        emi_amount: emiAmount,
        start_date: startDate,
        due_date: dueDate,
        loan_type: loanType,
        remaining_balance: principal,
        user_id: currentUserId
      });
      await get().init();
    } else {
      const updated = [newLoan, ...loans];
      set({ loans: updated });
      const currentLocal = JSON.parse(localStorage.getItem('capitals_local_data_v1') || '{}');
      localStorage.setItem('capitals_local_data_v1', JSON.stringify({ ...currentLocal, loans: updated }));
    }

    // Auto-register a reminder so this loan's EMI appears on the Calendar
    try {
      await get().addReminder(
        `EMI: ${lenderName}`,
        emiAmount,
        dueDate,
        'loan',
        '09:00:00',
        false
      );
    } catch (_) { /* best-effort */ }
  },

  deleteLoan: async (loanId) => {
    const { isPreviewMode, loans, reminders } = get();
    const updatedLoans = loans.filter(l => l.id !== loanId);
    // Also remove any associated reminders
    const updatedReminders = reminders.filter(r => !(r.type === 'loan' && r.title.includes(loans.find(l => l.id === loanId)?.lender_name || '__NONE__')));

    if (!isPreviewMode && supabase) {
      await supabase.from('loans').delete().eq('id', loanId);
      await get().init();
    } else {
      set({ loans: updatedLoans, reminders: updatedReminders });
      const currentLocal = JSON.parse(localStorage.getItem('capitals_local_data_v1') || '{}');
      localStorage.setItem('capitals_local_data_v1', JSON.stringify({ ...currentLocal, loans: updatedLoans, reminders: updatedReminders }));
    }
  },

  payLoanEmi: async (loanId, emiAmount) => {
    const { isPreviewMode, loans, reminders } = get();

    // Trigger an automatic expense log for Loans & EMI
    await get().addExpense(
      emiAmount,
      'Loans & EMI',
      'EMI Repayment',
      'EMI Payment',
      'UPI',
      undefined,
      'need',
      undefined,
      loanId
    );

    const advanceDateByOneMonth = (dateStr: string): string => {
      const [year, month, day] = dateStr.split('-').map(Number);
      let nextMonth = month + 1;
      let nextYear = year;
      if (nextMonth > 12) {
        nextMonth = 1;
        nextYear += 1;
      }
      const daysInNextMonth = new Date(nextYear, nextMonth, 0).getDate();
      const nextDay = Math.min(day, daysInNextMonth);
      return `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(nextDay).padStart(2, '0')}`;
    };

    const updatedLoans = loans.map(l => {
      if (l.id === loanId) {
        const paid = Number(l.total_paid) + emiAmount;
        const bal = Math.max(0, Number(l.principal) - paid);
        const nextDue = bal <= 0 ? l.due_date : advanceDateByOneMonth(l.due_date);
        return {
          ...l,
          total_paid: paid,
          remaining_balance: bal,
          due_date: nextDue,
          status: bal <= 0 ? 'paid' as const : l.status
        };
      }
      return l;
    });

    const updated = updatedLoans.find(l => l.id === loanId);

    if (!isPreviewMode && supabase) {
      if (updated) {
        await supabase
          .from('loans')
          .update({
            total_paid: updated.total_paid,
            remaining_balance: updated.remaining_balance,
            due_date: updated.due_date,
            status: updated.status
          })
          .eq('id', loanId);
      }
      await get().init();
    } else {
      set({ loans: updatedLoans });
      const currentLocal = JSON.parse(localStorage.getItem('capitals_local_data_v1') || '{}');
      localStorage.setItem('capitals_local_data_v1', JSON.stringify({ ...currentLocal, loans: updatedLoans }));
    }

    // Auto-mark any matching loan reminder for this month as paid
    if (updated) {
      const matchingRem = reminders.find(
        r => r.type === 'loan' &&
             r.status === 'pending' &&
             (r.title.toLowerCase().includes(updated.lender_name.toLowerCase()) || r.amount === emiAmount)
      );
      if (matchingRem) {
        const updatedRems = reminders.map(r => r.id === matchingRem.id ? { ...r, status: 'paid' as const } : r);
        if (!isPreviewMode && supabase) {
          await supabase.from('reminders').update({ status: 'paid' }).eq('id', matchingRem.id);
        } else {
          set({ reminders: updatedRems });
        }
      }

      // Auto-register a new reminder for the next month's EMI on the same day of the month
      if (updated.status === 'active') {
        try {
          await get().addReminder(
            `EMI: ${updated.lender_name}`,
            updated.emi_amount,
            updated.due_date,
            'loan',
            '09:00:00',
            false
          );
        } catch (_) { /* best-effort */ }
      }
    }
  },

  // ====================================================
  // SIP & INVESTMENTS
  // ====================================================
  addSip: async (fundName, monthlyAmount, startDate, nextPaymentDate, fundType, linkedGoalId) => {
    const { isPreviewMode, user, sips } = get();
    const currentUserId = user?.id || 'user-mock-123';

    const newSip: Sip = {
      id: `sip-${Math.random().toString(36).substr(2, 9)}`,
      user_id: currentUserId,
      fund_name: fundName,
      fund_type: fundType || 'mutual_fund',
      monthly_amount: monthlyAmount,
      start_date: startDate,
      next_payment_date: nextPaymentDate,
      total_invested: 0,
      current_value: 0,
      reminder_days_before: 3,
      status: 'active',
      linked_goal_id: linkedGoalId,
      created_at: new Date().toISOString()
    };

    if (!isPreviewMode && supabase) {
      await supabase.from('sips').insert({
        fund_name: fundName,
        monthly_amount: monthlyAmount,
        start_date: startDate,
        next_payment_date: nextPaymentDate,
        fund_type: fundType,
        linked_goal_id: linkedGoalId,
        user_id: currentUserId
      });
      await get().init();
    } else {
      const updated = [newSip, ...sips];
      set({ sips: updated });
      const currentLocal = JSON.parse(localStorage.getItem('capitals_local_data_v1') || '{}');
      localStorage.setItem('capitals_local_data_v1', JSON.stringify({ ...currentLocal, sips: updated }));
    }

    // Auto-register a reminder so this SIP appears on the Calendar
    try {
      await get().addReminder(
        `SIP Auto-Debit: ${fundName}`,
        monthlyAmount,
        nextPaymentDate,
        'sip',
        '09:00:00',
        false
      );
    } catch (_) { /* best-effort */ }
  },

  deleteSip: async (sipId) => {
    const { isPreviewMode, sips, reminders } = get();
    const sip = sips.find(s => s.id === sipId);
    const updatedSips = sips.filter(s => s.id !== sipId);
    const updatedReminders = reminders.filter(r => !(r.type === 'sip' && sip && r.title.includes(sip.fund_name)));

    if (!isPreviewMode && supabase) {
      await supabase.from('sips').delete().eq('id', sipId);
      await get().init();
    } else {
      set({ sips: updatedSips, reminders: updatedReminders });
      const currentLocal = JSON.parse(localStorage.getItem('capitals_local_data_v1') || '{}');
      localStorage.setItem('capitals_local_data_v1', JSON.stringify({ ...currentLocal, sips: updatedSips, reminders: updatedReminders }));
    }
  },

  updateSipValue: async (sipId, currentVal) => {
    const { isPreviewMode, sips } = get();
    const updated = sips.map(s => {
      if (s.id === sipId) {
        return { ...s, current_value: currentVal };
      }
      return s;
    });

    if (!isPreviewMode && supabase) {
      await supabase.from('sips').update({ current_value: currentVal }).eq('id', sipId);
      await get().init();
    } else {
      set({ sips: updated });
      const currentLocal = JSON.parse(localStorage.getItem('capitals_local_data_v1') || '{}');
      localStorage.setItem('capitals_local_data_v1', JSON.stringify({ ...currentLocal, sips: updated }));
    }
  },

  // ====================================================
  // BUDGET & GOALS
  // ====================================================
  addBudget: async (category, limit, month, year, rollover) => {
    const { isPreviewMode, user, budgets } = get();
    const currentUserId = user?.id || 'user-mock-123';

    const newBud: Budget = {
      id: `bud-${Math.random().toString(36).substr(2, 9)}`,
      user_id: currentUserId,
      category,
      monthly_limit: limit,
      spent: 0,
      month,
      year,
      rollover_enabled: rollover,
      created_at: new Date().toISOString()
    };

    if (!isPreviewMode && supabase) {
      await supabase.from('budgets').insert({
        category,
        monthly_limit: limit,
        month,
        year,
        rollover_enabled: rollover,
        user_id: currentUserId
      });
      await get().init();
    } else {
      const updated = [newBud, ...budgets];
      set({ budgets: updated });
      const currentLocal = JSON.parse(localStorage.getItem('capitals_local_data_v1') || '{}');
      localStorage.setItem('capitals_local_data_v1', JSON.stringify({ ...currentLocal, budgets: updated }));
    }
  },

  addGoal: async (name, targetAmount, deadline, contribution, category, icon) => {
    const { isPreviewMode, user, goals } = get();
    const currentUserId = user?.id || 'user-mock-123';

    const newGoal: Goal = {
      id: `goal-${Math.random().toString(36).substr(2, 9)}`,
      user_id: currentUserId,
      name,
      target_amount: targetAmount,
      saved_amount: 0,
      deadline,
      monthly_contribution: contribution,
      category,
      status: 'in_progress',
      icon: icon || 'account_balance',
      created_at: new Date().toISOString()
    };

    if (!isPreviewMode && supabase) {
      await supabase.from('goals').insert({
        name,
        target_amount: targetAmount,
        deadline,
        monthly_contribution: contribution,
        category,
        icon,
        user_id: currentUserId
      });
      await get().init();
    } else {
      const updated = [newGoal, ...goals];
      set({ goals: updated });
      const currentLocal = JSON.parse(localStorage.getItem('capitals_local_data_v1') || '{}');
      localStorage.setItem('capitals_local_data_v1', JSON.stringify({ ...currentLocal, goals: updated }));
    }
  },

  contributeToGoal: async (goalId, amount) => {
    const { isPreviewMode, goals } = get();

    // Trigger an Investment expense
    await get().addExpense(
      amount,
      'Investments',
      'Goal Savings',
      `Contribution to Goal`,
      'UPI',
      undefined,
      'need'
    );

    const updated = goals.map(g => {
      if (g.id === goalId) {
        const saved = Number(g.saved_amount) + amount;
        return {
          ...g,
          saved_amount: saved,
          status: saved >= Number(g.target_amount) ? ('achieved' as const) : g.status
        };
      }
      return g;
    });

    if (!isPreviewMode && supabase) {
      const matched = updated.find(g => g.id === goalId);
      if (matched) {
        await supabase
          .from('goals')
          .update({
            saved_amount: matched.saved_amount,
            status: matched.status
          })
          .eq('id', goalId);
      }
      await get().init();
    } else {
      set({ goals: updated });
      const currentLocal = JSON.parse(localStorage.getItem('capitals_local_data_v1') || '{}');
      localStorage.setItem('capitals_local_data_v1', JSON.stringify({ ...currentLocal, goals: updated }));
    }
  },

  // ====================================================
  // REMINDERS & CALENDAR
  // ====================================================
  addReminder: async (title, amount, dueDate, type, reminderTime, autopay) => {
    const { isPreviewMode, user, reminders } = get();
    const currentUserId = user?.id || 'user-mock-123';

    const newRem: Reminder = {
      id: `rem-${Math.random().toString(36).substr(2, 9)}`,
      user_id: currentUserId,
      title,
      amount,
      due_date: dueDate,
      type,
      status: 'pending',
      reminder_time: reminderTime || '09:00:00',
      autopay,
      created_at: new Date().toISOString()
    };

    if (!isPreviewMode && supabase) {
      await supabase.from('reminders').insert({
        title,
        amount,
        due_date: dueDate,
        type,
        reminder_time: reminderTime,
        autopay,
        user_id: currentUserId
      });
      await get().init();
    } else {
      const updated = [newRem, ...reminders];
      set({ reminders: updated });
      const currentLocal = JSON.parse(localStorage.getItem('capitals_local_data_v1') || '{}');
      localStorage.setItem('capitals_local_data_v1', JSON.stringify({ ...currentLocal, reminders: updated }));
    }
  },

  markReminderPaid: async (reminderId) => {
    const { isPreviewMode, reminders } = get();
    const reminder = reminders.find(r => r.id === reminderId);
    if (!reminder) return;

    // Handle payment simulation
    if (reminder.type === 'loan' && reminder.amount) {
      const cleanTitle = reminder.title.toLowerCase().replace('emi:', '').replace('emi repayment:', '').replace('emi payment:', '').trim();
      const activeLoan = get().loans.find(l => cleanTitle.includes(l.lender_name.toLowerCase()) || l.lender_name.toLowerCase().includes(cleanTitle)) ||
                         get().loans.find(l => l.emi_amount === reminder.amount);
      if (activeLoan) {
        await get().payLoanEmi(activeLoan.id, reminder.amount);
      }
    } else if (reminder.type === 'sip' && reminder.amount) {
      const cleanTitle = reminder.title.toLowerCase().replace('sip auto-debit:', '').replace('sip:', '').trim();
      const activeSip = get().sips.find(s => cleanTitle.includes(s.fund_name.toLowerCase()) || s.fund_name.toLowerCase().includes(cleanTitle)) ||
                        get().sips.find(s => s.monthly_amount === reminder.amount);
      if (activeSip) {
        // Log expense
        await get().addExpense(
          reminder.amount,
          'Investments',
          'SIP Payment',
          reminder.title,
          'UPI',
          activeSip.fund_name,
          'need'
        );

        const advanceDateByOneMonth = (dateStr: string): string => {
          const [year, month, day] = dateStr.split('-').map(Number);
          let nextMonth = month + 1;
          let nextYear = year;
          if (nextMonth > 12) {
            nextMonth = 1;
            nextYear += 1;
          }
          const daysInNextMonth = new Date(nextYear, nextMonth, 0).getDate();
          const nextDay = Math.min(day, daysInNextMonth);
          return `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(nextDay).padStart(2, '0')}`;
        };

        const nextPayment = advanceDateByOneMonth(activeSip.next_payment_date);

        if (!isPreviewMode && supabase) {
          await supabase
            .from('sips')
            .update({
              next_payment_date: nextPayment,
              total_invested: Number(activeSip.total_invested) + reminder.amount,
              current_value: Number(activeSip.current_value) + reminder.amount
            })
            .eq('id', activeSip.id);
          await get().init();
        } else {
          const updatedSips = get().sips.map(s => {
            if (s.id === activeSip.id) {
              return {
                ...s,
                next_payment_date: nextPayment,
                total_invested: Number(s.total_invested) + reminder.amount!,
                current_value: Number(s.current_value) + reminder.amount!
              };
            }
            return s;
          });
          set({ sips: updatedSips });
          const currentLocal = JSON.parse(localStorage.getItem('capitals_local_data_v1') || '{}');
          localStorage.setItem('capitals_local_data_v1', JSON.stringify({ ...currentLocal, sips: updatedSips }));
        }

        // Add a new reminder for the next month's SIP on the same day of the month
        try {
          await get().addReminder(
            `SIP Auto-Debit: ${activeSip.fund_name}`,
            activeSip.monthly_amount,
            nextPayment,
            'sip',
            '09:00:00',
            false
          );
        } catch (_) { /* best-effort */ }
      }
    } else if (reminder.amount) {
      // General subscription, rent or custom
      const categoryMap: Record<string, string> = {
        subscription: 'Subscriptions',
        rent: 'Housing',
        recharge: 'Miscellaneous',
        exam_fee: 'Education'
      };
      await get().addExpense(reminder.amount, categoryMap[reminder.type] || 'Miscellaneous', reminder.type, reminder.title, 'UPI', undefined, 'need');
    }

    const updated = reminders.map(r => {
      if (r.id === reminderId) {
        return { ...r, status: 'paid' as const };
      }
      return r;
    });

    if (!isPreviewMode && supabase) {
      await supabase.from('reminders').update({ status: 'paid' }).eq('id', reminderId);
      await get().init();
    } else {
      set({ reminders: updated });
      const currentLocal = JSON.parse(localStorage.getItem('capitals_local_data_v1') || '{}');
      localStorage.setItem('capitals_local_data_v1', JSON.stringify({ ...currentLocal, reminders: updated }));
    }
  },

  deleteReminder: async (reminderId) => {
    const { isPreviewMode, reminders } = get();
    const updated = reminders.filter(r => r.id !== reminderId);

    if (!isPreviewMode && supabase) {
      await supabase.from('reminders').delete().eq('id', reminderId);
      await get().init();
    } else {
      set({ reminders: updated });
      const currentLocal = JSON.parse(localStorage.getItem('capitals_local_data_v1') || '{}');
      localStorage.setItem('capitals_local_data_v1', JSON.stringify({ ...currentLocal, reminders: updated }));
    }
  },

  // ====================================================
  // SPLIT BILLS & FRIENDS
  // ====================================================
  addFriend: async (name, phone, upiId) => {
    const { isPreviewMode, user, friends } = get();
    const currentUserId = user?.id || 'user-mock-123';

    const newFriend: Friend = {
      id: `fr-${Math.random().toString(36).substr(2, 9)}`,
      user_id: currentUserId,
      friend_name: name,
      phone,
      upi_id: upiId,
      created_at: new Date().toISOString()
    };

    if (!isPreviewMode && supabase) {
      await supabase.from('friends').insert({
        friend_name: name,
        phone,
        upi_id: upiId,
        user_id: currentUserId
      });
      await get().init();
    } else {
      const updated = [...friends, newFriend];
      set({ friends: updated });
      const currentLocal = JSON.parse(localStorage.getItem('capitals_local_data_v1') || '{}');
      localStorage.setItem('capitals_local_data_v1', JSON.stringify({ ...currentLocal, friends: updated }));
    }
  },

  deleteFriend: async (friendId) => {
    const { isPreviewMode, friends } = get();
    const updated = friends.filter(f => f.id !== friendId);
    
    if (!isPreviewMode && supabase) {
      await supabase.from('friends').delete().eq('id', friendId);
      await get().init();
    } else {
      set({ friends: updated });
      const currentLocal = JSON.parse(localStorage.getItem('capitals_local_data_v1') || '{}');
      localStorage.setItem('capitals_local_data_v1', JSON.stringify({ ...currentLocal, friends: updated }));
    }
  },

  addSharedExpense: async (paidBy, amount, description, splitBetween, tripId) => {
    const { isPreviewMode, user, sharedExpenses } = get();
    const currentUserId = user?.id || 'user-mock-123';

    const newShared: SharedExpense = {
      id: `se-${Math.random().toString(36).substr(2, 9)}`,
      user_id: currentUserId,
      paid_by: paidBy,
      amount,
      description,
      split_between: splitBetween,
      trip_id: tripId,
      date: new Date().toISOString().split('T')[0],
      settled: false,
      created_at: new Date().toISOString()
    };

    // If paid by "You", record an expense for your share
    if (paidBy === 'You' || paidBy === currentUserId) {
      const myShare = amount / splitBetween.length;
      await get().addExpense(
        myShare,
        'Social',
        'Split Expense Share',
        `Share of: ${description}`,
        'UPI',
        undefined,
        'want',
        tripId
      );
    }

    if (!isPreviewMode && supabase) {
      await supabase.from('shared_expenses').insert({
        paid_by: paidBy,
        amount,
        description,
        split_between: splitBetween,
        trip_id: tripId,
        user_id: currentUserId
      });
      await get().init();
    } else {
      const updated = [newShared, ...sharedExpenses];
      set({ sharedExpenses: updated });
      const currentLocal = JSON.parse(localStorage.getItem('capitals_local_data_v1') || '{}');
      localStorage.setItem('capitals_local_data_v1', JSON.stringify({ ...currentLocal, sharedExpenses: updated }));
    }
  },

  settleSplitBill: async (sharedExpenseId, fromUser, toUser, amount) => {
    const { isPreviewMode, sharedExpenses, settlements } = get();

    const newSettlement: Settlement = {
      id: `sett-${Math.random().toString(36).substr(2, 9)}`,
      shared_expense_id: sharedExpenseId,
      from_user: fromUser,
      to_user: toUser,
      amount,
      settled_at: new Date().toISOString()
    };

    // Determine whether ALL other participants of this bill have settled
    const updatedSettlements = [newSettlement, ...settlements];
    const updatedShared = sharedExpenses.map(se => {
      if (se.id === sharedExpenseId) {
        // Other participants = everyone who is NOT the original payer
        const otherParticipants = se.split_between.filter(p => p !== se.paid_by);
        // Count how many of those now have a settlement record (including the new one)
        const settledCount = updatedSettlements.filter(
          s => s.shared_expense_id === sharedExpenseId
        ).length;
        const isFullySettled = settledCount >= otherParticipants.length;
        return { ...se, settled: isFullySettled };
      }
      return se;
    });

    if (!isPreviewMode && supabase) {
      await supabase.from('settlements').insert({
        shared_expense_id: sharedExpenseId,
        from_user: fromUser,
        to_user: toUser,
        amount
      });
      // Only mark the shared expense as fully settled when everyone has paid
      const se = sharedExpenses.find(e => e.id === sharedExpenseId);
      if (se) {
        const otherParticipants = se.split_between.filter(p => p !== se.paid_by);
        const { count } = await supabase
          .from('settlements')
          .select('id', { count: 'exact', head: true })
          .eq('shared_expense_id', sharedExpenseId);
        const isFullySettled = (count ?? 0) + 1 >= otherParticipants.length;
        if (isFullySettled) {
          await supabase.from('shared_expenses').update({ settled: true }).eq('id', sharedExpenseId);
        }
      }
      await get().init();
    } else {
      set({ sharedExpenses: updatedShared, settlements: updatedSettlements });
      const currentLocal = JSON.parse(localStorage.getItem('capitals_local_data_v1') || '{}');
      localStorage.setItem('capitals_local_data_v1', JSON.stringify({ 
        ...currentLocal, 
        sharedExpenses: updatedShared, 
        settlements: updatedSettlements 
      }));
    }
  },

  // ====================================================
  // SUBSCRIPTIONS
  // ====================================================
  addSubscription: async (name, amount, renewalDate, frequency, category, sharedWith, splitRatio) => {
    const { isPreviewMode, user, subscriptions } = get();
    const currentUserId = user?.id || 'user-mock-123';

    const newSub: Subscription = {
      id: `sub-${Math.random().toString(36).substr(2, 9)}`,
      user_id: currentUserId,
      name,
      amount,
      renewal_date: renewalDate,
      frequency,
      category: category || 'Entertainment',
      shared_with: sharedWith,
      split_ratio: splitRatio,
      status: 'active',
      created_at: new Date().toISOString()
    };

    if (!isPreviewMode && supabase) {
      await supabase.from('subscriptions').insert({
        name,
        amount,
        renewal_date: renewalDate,
        frequency,
        category,
        shared_with: sharedWith,
        split_ratio: splitRatio,
        user_id: currentUserId
      });
      await get().init();
    } else {
      const updated = [newSub, ...subscriptions];
      set({ subscriptions: updated });
      const currentLocal = JSON.parse(localStorage.getItem('capitals_local_data_v1') || '{}');
      localStorage.setItem('capitals_local_data_v1', JSON.stringify({ ...currentLocal, subscriptions: updated }));
    }
  },

  dismissInsight: async (insightId) => {
    const { isPreviewMode, insights } = get();
    const updated = insights.map(i => {
      if (i.id === insightId) return { ...i, dismissed: true };
      return i;
    }).filter(i => !i.dismissed);

    if (!isPreviewMode && supabase) {
      await supabase.from('ai_insights').update({ dismissed: true }).eq('id', insightId);
      await get().init();
    } else {
      set({ insights: updated });
      const currentLocal = JSON.parse(localStorage.getItem('capitals_local_data_v1') || '{}');
      localStorage.setItem('capitals_local_data_v1', JSON.stringify({ ...currentLocal, insights: updated }));
    }
  },

  addCreditCard: async (cardName, bankName, cardLimit, dueDate, statementDate, cardNetwork, cardTheme) => {
    const { isPreviewMode, user, creditCards } = get();
    const currentUserId = user?.id || 'user-mock-123';

    const newCard: CreditCard = {
      id: `cc-${Math.random().toString(36).substr(2, 9)}`,
      user_id: currentUserId,
      card_name: cardName,
      bank_name: bankName,
      card_limit: cardLimit,
      outstanding_balance: 0,
      due_date: dueDate,
      statement_date: statementDate,
      card_network: cardNetwork,
      card_theme: cardTheme || 'dark_metal',
      created_at: new Date().toISOString()
    };

    if (!isPreviewMode && supabase) {
      await supabase.from('credit_cards').insert({
        card_name: cardName,
        bank_name: bankName,
        card_limit: cardLimit,
        outstanding_balance: 0,
        due_date: dueDate,
        statement_date: statementDate,
        card_network: cardNetwork,
        card_theme: cardTheme || 'dark_metal',
        user_id: currentUserId
      });
      await get().init();
    } else {
      const updated = [newCard, ...creditCards];
      set({ creditCards: updated });
      const currentLocal = JSON.parse(localStorage.getItem('capitals_local_data_v1') || '{}');
      localStorage.setItem('capitals_local_data_v1', JSON.stringify({ ...currentLocal, creditCards: updated }));
    }

    // Auto-create a payment reminder for this credit card bill
    try {
      await get().addReminder(
        `Credit Card Bill: ${bankName} ${cardName}`,
        0, // amount is 0 initially, will update when statements are computed
        dueDate,
        'custom',
        '09:00:00',
        false
      );
    } catch (e) {
      console.error("Failed to auto-register credit card reminder", e);
    }
  },

  deleteCreditCard: async (cardId) => {
    const { isPreviewMode, creditCards } = get();

    if (!isPreviewMode && supabase) {
      await supabase.from('credit_cards').delete().eq('id', cardId);
      await get().init();
    } else {
      const updated = creditCards.filter(c => c.id !== cardId);
      set({ creditCards: updated });
      const currentLocal = JSON.parse(localStorage.getItem('capitals_local_data_v1') || '{}');
      localStorage.setItem('capitals_local_data_v1', JSON.stringify({ ...currentLocal, creditCards: updated }));
    }
  },

  payCardBill: async (cardId, amount) => {
    const { isPreviewMode, creditCards } = get();
    const card = creditCards.find(c => c.id === cardId);
    if (!card) return;

    // 1. Pay the bill - decreases outstanding balance
    const newBalance = Math.max(0, Number(card.outstanding_balance) - amount);

    // 2. Generate a standard payment expense transaction
    await get().addExpense(
      amount,
      'Loans & EMI',
      'Credit Card Bill',
      `Settled credit card bill for ${card.bank_name} ${card.card_name}`,
      'UPI', // Default payment mode for bill clearance
      undefined,
      'need',
      undefined,
      undefined,
      new Date().toISOString().split('T')[0]
    );

    // 3. Update the credit card balance record
    if (!isPreviewMode && supabase) {
      await supabase
        .from('credit_cards')
        .update({ outstanding_balance: newBalance })
        .eq('id', cardId);
      await get().init();
    } else {
      const updated = creditCards.map(c => {
        if (c.id === cardId) {
          return { ...c, outstanding_balance: newBalance };
        }
        return c;
      });
      set({ creditCards: updated });
      const currentLocal = JSON.parse(localStorage.getItem('capitals_local_data_v1') || '{}');
      localStorage.setItem('capitals_local_data_v1', JSON.stringify({ ...currentLocal, creditCards: updated }));
    }
  },

  // ====================================================
  // BROKEMAN PREDICTIVE RUNWAY ENGINE
  // ====================================================
  getBrokemanTelemetry: () => {
    const { incomes, expenses, user } = get();
    
    // 1. Calculate Total Balance
    const totalIn = incomes.reduce((acc, curr) => acc + Number(curr.amount), 0);
    const totalOut = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
    const totalBalance = Math.max(0, totalIn - totalOut);

    // 2. Days remaining in current month
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const daysRemainingInMonth = Math.max(1, lastDayOfMonth.getDate() - today.getDate());

    // 3. Daily disposable runway (Balance / remaining days)
    const dailyDisposableRunway = Math.round((totalBalance / daysRemainingInMonth) * 100) / 100;

    // 4. Burn Rate 7D (Average daily spend of last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const last7DExpenses = expenses.filter(e => new Date(e.date) >= sevenDaysAgo);
    const total7DSpend = last7DExpenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
    const burnRate7D = Math.round((total7DSpend / 7) * 100) / 100;

    // 5. Runway days (Balance / 7D Burn Rate)
    const runwayDays = burnRate7D > 0 ? Math.floor(totalBalance / burnRate7D) : 999;

    // 6. Exhaustion Date
    const exDate = new Date();
    if (burnRate7D > 0) {
      exDate.setDate(exDate.getDate() + runwayDays);
    } else {
      exDate.setDate(exDate.getDate() + 999);
    }
    const exhaustionDateString = exDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    // 7. Critical status check
    const isCritical = runwayDays < 5 || totalBalance < 1500;

    return {
      totalBalance,
      daysRemainingInMonth,
      dailyDisposableRunway,
      burnRate7D,
      runwayDays,
      exhaustionDate: runwayDays > 365 ? 'No imminent threat' : exhaustionDateString,
      isCritical
    };
  }
}));
