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

// ====================================================
// INITIAL MOCK DATA (INDIAN STUDENTS)
// ====================================================

const MOCK_USER: UserProfile = {
  id: 'user-mock-123',
  name: 'Hithesh Reddy',
  email: 'hithesh@iitm.ac.in',
  college: 'IIT Madras',
  city: 'Chennai',
  student_type: 'undergraduate',
  currency: 'INR',
  monthly_allowance: 12000,
  main_income_source: 'parents',
  has_loan: true,
  has_sip: true,
  financial_goal: 'Buy OnePlus 13',
  preferred_reminder_time: '20:00',
  avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Hithesh',
  created_at: new Date().toISOString(),
};

const MOCK_INCOME: Income[] = [
  { id: 'inc-1', user_id: 'user-mock-123', amount: 10000, source: 'parent_allowance', date: '2026-05-01', note: 'Monthly allowance from Mom', payment_mode: 'UPI' },
  { id: 'inc-2', user_id: 'user-mock-123', amount: 4500, source: 'freelancing', date: '2026-05-15', note: 'Web dev contract payout', payment_mode: 'UPI', client_name: 'Dosa Hut website' },
  { id: 'inc-3', user_id: 'user-mock-123', amount: 1500, source: 'gift', date: '2026-05-20', note: 'Birthday money from Uncle', payment_mode: 'UPI' }
];

const MOCK_EXPENSES: Expense[] = [
  { id: 'exp-1', user_id: 'user-mock-123', amount: 350, category: 'Food & Dining', subcategory: 'Dinner', date: '2026-05-24', note: 'Swiggy Biryani', payment_mode: 'UPI', venue_name: 'Swiggy', tag: 'want' },
  { id: 'exp-2', user_id: 'user-mock-123', amount: 150, category: 'Travel', subcategory: 'Metro', date: '2026-05-25', note: 'Chennai Metro smartcard', payment_mode: 'UPI', venue_name: 'CMRL', tag: 'need' },
  { id: 'exp-3', user_id: 'user-mock-123', amount: 649, category: 'Subscriptions', subcategory: 'Entertainment', date: '2026-05-05', note: 'Netflix premium split', payment_mode: 'UPI', venue_name: 'Netflix', tag: 'want' },
  { id: 'exp-4', user_id: 'user-mock-123', amount: 1999, category: 'Shopping', subcategory: 'Apparel', date: '2026-05-18', note: 'Hoodie from H&M', payment_mode: 'UPI', venue_name: 'H&M Express', tag: 'impulse' },
  { id: 'exp-5', user_id: 'user-mock-123', amount: 1500, category: 'Investments', subcategory: 'Mutual Fund', date: '2026-05-10', note: 'Groww SIP auto-debit', payment_mode: 'UPI', venue_name: 'Quant Small Cap', tag: 'need' },
  { id: 'exp-6', user_id: 'user-mock-123', amount: 1050, category: 'Loans & EMI', subcategory: 'EMI', date: '2026-05-07', note: 'mPokket due paid', payment_mode: 'UPI', venue_name: 'mPokket', tag: 'need' },
  { id: 'exp-7', user_id: 'user-mock-123', amount: 150, category: 'Food & Dining', subcategory: 'Snacks', date: '2026-05-25', note: 'Maggie and Tea at Nescafe', payment_mode: 'Cash', venue_name: 'Nescafe IITM', tag: 'need' }
];

const MOCK_LOANS: Loan[] = [
  {
    id: 'loan-1',
    user_id: 'user-mock-123',
    lender_name: 'mPokket',
    loan_type: 'app',
    principal: 4000,
    interest_rate: 24,
    emi_amount: 1050,
    start_date: '2026-04-10',
    due_date: '2026-06-10',
    total_paid: 2100,
    remaining_balance: 1900,
    status: 'active',
    notes: 'Short term cash loan for college semester exam fees'
  }
];

const MOCK_SIPS: Sip[] = [
  {
    id: 'sip-1',
    user_id: 'user-mock-123',
    fund_name: 'Quant Small Cap Mutual Fund',
    fund_type: 'mutual_fund',
    monthly_amount: 1500,
    start_date: '2026-01-10',
    next_payment_date: '2026-06-10',
    total_invested: 7500,
    current_value: 8450,
    reminder_days_before: 3,
    status: 'active'
  }
];

const MOCK_BUDGETS: Budget[] = [
  { id: 'bud-1', user_id: 'user-mock-123', category: 'Food & Dining', monthly_limit: 4500, spent: 2150, month: 5, year: 2026, rollover_enabled: true },
  { id: 'bud-2', user_id: 'user-mock-123', category: 'Travel', monthly_limit: 1500, spent: 650, month: 5, year: 2026, rollover_enabled: false },
  { id: 'bud-3', user_id: 'user-mock-123', category: 'Shopping', monthly_limit: 3000, spent: 2200, month: 5, year: 2026, rollover_enabled: false },
  { id: 'bud-4', user_id: 'user-mock-123', category: 'Subscriptions', monthly_limit: 1000, spent: 649, month: 5, year: 2026, rollover_enabled: false }
];

const MOCK_GOALS: Goal[] = [
  { id: 'goal-1', user_id: 'user-mock-123', name: 'OnePlus 13', target_amount: 60000, saved_amount: 18000, deadline: '2026-10-31', monthly_contribution: 6000, category: 'Gadgets', status: 'in_progress', icon: 'smartphone' },
  { id: 'goal-2', user_id: 'user-mock-123', name: 'Goa Trip with hostel mates', target_amount: 10000, saved_amount: 4500, deadline: '2026-08-15', monthly_contribution: 2000, category: 'Travel', status: 'in_progress', icon: 'flight_takeoff' }
];

const MOCK_REMINDERS: Reminder[] = [
  { id: 'rem-1', user_id: 'user-mock-123', title: 'mPokket Loan EMI Due', amount: 1050, due_date: '2026-06-10', type: 'loan', status: 'pending', reminder_time: '10:00:00' },
  { id: 'rem-2', user_id: 'user-mock-123', title: 'Quant Small Cap SIP', amount: 1500, due_date: '2026-06-10', type: 'sip', status: 'pending', reminder_time: '09:00:00' },
  { id: 'rem-3', user_id: 'user-mock-123', title: 'Netflix Premium AutoPay', amount: 216, due_date: '2026-06-05', type: 'subscription', status: 'pending', reminder_time: '12:00:00' }
];

const MOCK_FRIENDS: Friend[] = [
  { id: 'fr-1', user_id: 'user-mock-123', friend_name: 'Amit Sharma', phone: '9876543210', upi_id: 'amit@okhdfc' },
  { id: 'fr-2', user_id: 'user-mock-123', friend_name: 'Sneha Patel', phone: '9876543211', upi_id: 'sneha@okaxis' },
  { id: 'fr-3', user_id: 'user-mock-123', friend_name: 'Rahul Verma', phone: '9876543212', upi_id: 'rahul@okicici' }
];

const MOCK_SHARED_EXPENSES: SharedExpense[] = [
  { id: 'se-1', user_id: 'user-mock-123', paid_by: 'You', amount: 1200, description: 'Group Dinner at Cafe Bilbo', split_between: ['You', 'Amit Sharma', 'Sneha Patel', 'Rahul Verma'], date: '2026-05-24', settled: false }
];

const MOCK_SUBSCRIPTIONS: Subscription[] = [
  { id: 'sub-1', user_id: 'user-mock-123', name: 'Netflix Premium', amount: 649, renewal_date: '2026-06-05', frequency: 'monthly', category: 'Entertainment', shared_with: ['Amit Sharma', 'Sneha Patel'], split_ratio: [0.33, 0.33, 0.34], status: 'active' },
  { id: 'sub-2', user_id: 'user-mock-123', name: 'Spotify Premium', amount: 129, renewal_date: '2026-06-08', frequency: 'monthly', category: 'Music', status: 'active' }
];

const MOCK_INSIGHTS: AiInsight[] = [
  { id: 'ai-1', user_id: 'user-mock-123', message: 'You spent ₹2,200 on Shopping this month, which is 73% of your shopping limit. Proceed with caution to avoid early balance exhaustion.', type: 'warning', dismissed: false },
  { id: 'ai-2', user_id: 'user-mock-123', message: 'Impulse guard status: ₹1,999 of your spending was flagged as an Impulse buy (H&M Hoodie). We recommend locking impulse spending for the next 5 days.', type: 'safety', dismissed: false },
  { id: 'ai-3', user_id: 'user-mock-123', message: 'Streak alert! 3 days without an impulse purchase. Keep it going to earn the frugality badge!', type: 'achievement', dismissed: false }
];

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

  // Core Actions
  init: () => Promise<void>;
  setUser: (user: UserProfile | null) => void;
  
  // Mutations
  addIncome: (amount: number, source: string, note?: string, paymentMode?: string, isRecurring?: boolean, frequency?: string, clientName?: string, expectedPayoutDate?: string) => Promise<void>;
  addExpense: (amount: number, category: string, subcategory?: string, note?: string, paymentMode?: string, venueName?: string, tag?: 'need' | 'want' | 'impulse', tripId?: string, linkedLoanId?: string) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
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
  savingsStreak: 3, // Mock initial streak
  noSpendDays: [],

  init: async () => {
    // Check if Supabase keys exist & user session is present
    if (isSupabaseConfigured) {
      try {
        const { data: { session } } = await supabase!.auth.getSession();
        if (session) {
          const userId = session.user.id;
          
          // 1. Fetch user profile
          const { data: userProfile } = await supabase!
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

          if (userProfile) {
            // 2. Fetch user data tables
            const [
              incRes, expRes, tripRes, tripExpRes, loanRes,
              sipRes, budRes, goalRes, remRes, friendRes,
              sharedRes, settRes, subRes, insRes
            ] = await Promise.all([
              supabase!.from('income').select('*').eq('user_id', userId),
              supabase!.from('expenses').select('*').eq('user_id', userId),
              supabase!.from('trips').select('*').eq('user_id', userId),
              supabase!.from('trip_expenses').select('*').eq('user_id', userId),
              supabase!.from('loans').select('*').eq('user_id', userId),
              supabase!.from('sips').select('*').eq('user_id', userId),
              supabase!.from('budgets').select('*').eq('user_id', userId),
              supabase!.from('goals').select('*').eq('user_id', userId),
              supabase!.from('reminders').select('*').eq('user_id', userId),
              supabase!.from('friends').select('*').eq('user_id', userId),
              supabase!.from('shared_expenses').select('*').eq('user_id', userId),
              supabase!.from('settlements').select('*, shared_expenses!inner(user_id)').eq('shared_expenses.user_id', userId),
              supabase!.from('subscriptions').select('*').eq('user_id', userId),
              supabase!.from('ai_insights').select('*').eq('user_id', userId).eq('dismissed', false),
            ]);

            set({
              isPreviewMode: false,
              user: userProfile,
              incomes: incRes.data || [],
              expenses: expRes.data || [],
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
            });
            return;
          }
        }
      } catch (err) {
        console.error("Failed to initialize Supabase, fallback to empty state", err);
      }
    }

    // No Supabase session — start with clean empty state (no mock data)
    // Check localStorage for any previously saved real data
    const localData = localStorage.getItem('capitals_local_data_v1');
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        // Only load if this was real user data (has a non-mock user id)
        if (parsed.user && parsed.user.id && parsed.user.id !== 'user-mock-123') {
          set({
            isPreviewMode: false,
            user: parsed.user,
            incomes: parsed.incomes || [],
            expenses: parsed.expenses || [],
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
            savingsStreak: parsed.savingsStreak ?? 0,
            noSpendDays: parsed.noSpendDays || [],
          });
          return;
        }
      } catch (e) {
        console.error("Failed parsing local storage", e);
      }
    }

    // Completely fresh — clear any stale mock data and show empty state
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
  addIncome: async (amount, source, note, paymentMode, isRecurring, frequency, clientName, expectedPayoutDate) => {
    const { user, isPreviewMode, incomes } = get();
    const currentUserId = user?.id || 'user-mock-123';

    const newIncome: Income = {
      id: `inc-${Math.random().toString(36).substr(2, 9)}`,
      user_id: currentUserId,
      amount,
      source,
      date: new Date().toISOString().split('T')[0],
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
  addExpense: async (amount, category, subcategory, note, paymentMode, venueName, tag, tripId, linkedLoanId) => {
    const { user, isPreviewMode, expenses, budgets, noSpendDays, savingsStreak } = get();
    const currentUserId = user?.id || 'user-mock-123';

    const newExpense: Expense = {
      id: `exp-${Math.random().toString(36).substr(2, 9)}`,
      user_id: currentUserId,
      amount,
      category,
      subcategory,
      date: new Date().toISOString().split('T')[0],
      note,
      payment_mode: paymentMode || 'UPI',
      venue_name: venueName,
      tag: tag || 'need',
      trip_id: tripId,
      linked_loan_id: linkedLoanId,
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
        payment_mode: paymentMode,
        venue_name: venueName,
        tag,
        trip_id: tripId,
        linked_loan_id: linkedLoanId,
        user_id: currentUserId
      });
      if (error) throw error;
      
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
      const updatedExpenses = [newExpense, ...expenses];
      set({ 
        expenses: updatedExpenses, 
        budgets: updatedBudgets,
        savingsStreak: newStreak,
        noSpendDays: updatedNoSpend
      });
      const currentLocal = JSON.parse(localStorage.getItem('capitals_local_data_v1') || '{}');
      localStorage.setItem('capitals_local_data_v1', JSON.stringify({ 
        ...currentLocal, 
        expenses: updatedExpenses,
        budgets: updatedBudgets,
        savingsStreak: newStreak,
        noSpendDays: updatedNoSpend
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
      const updatedExpenses = expenses.filter(e => e.id !== id);
      set({ expenses: updatedExpenses, budgets: updatedBudgets });
      const currentLocal = JSON.parse(localStorage.getItem('capitals_local_data_v1') || '{}');
      localStorage.setItem('capitals_local_data_v1', JSON.stringify({ 
        ...currentLocal, 
        expenses: updatedExpenses,
        budgets: updatedBudgets
      }));
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
    const { isPreviewMode, loans } = get();

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

    const updatedLoans = loans.map(l => {
      if (l.id === loanId) {
        const paid = Number(l.total_paid) + emiAmount;
        const bal = Math.max(0, Number(l.principal) - paid);
        return {
          ...l,
          total_paid: paid,
          remaining_balance: bal,
          status: bal <= 0 ? 'paid' as const : l.status
        };
      }
      return l;
    });

    if (!isPreviewMode && supabase) {
      const updated = updatedLoans.find(l => l.id === loanId);
      if (updated) {
        await supabase
          .from('loans')
          .update({
            total_paid: updated.total_paid,
            remaining_balance: updated.remaining_balance,
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
      const activeLoan = get().loans.find(l => l.lender_name.toLowerCase() === reminder.title.toLowerCase() || l.emi_amount === reminder.amount);
      if (activeLoan) {
        await get().payLoanEmi(activeLoan.id, reminder.amount);
      }
    } else if (reminder.type === 'sip' && reminder.amount) {
      const activeSip = get().sips.find(s => s.monthly_amount === reminder.amount);
      if (activeSip) {
        await get().addExpense(reminder.amount, 'Investments', 'SIP Payment', reminder.title, 'UPI', activeSip.fund_name, 'need');
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
