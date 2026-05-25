import { z } from 'zod';

// 1. User Profile validation
export const userProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  college: z.string().max(150).optional(),
  city: z.string().max(100).optional(),
  student_type: z.enum(['school', 'undergraduate', 'postgraduate', 'self_taught']).optional(),
  monthly_allowance: z.number().nonnegative().max(1000000).optional(),
  main_income_source: z.string().max(100).optional(),
  financial_goal: z.string().max(200).optional(),
  preferred_reminder_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)").optional()
}).strict();

// 2. Income validation
export const incomeSchema = z.object({
  amount: z.number().positive("Inflow amount must be positive").max(10000000),
  source: z.enum([
    'parent_allowance', 'pocket_money', 'freelancing', 'internship_stipend', 
    'part_time_job', 'scholarship', 'gift', 'refund', 'side_hustle', 
    'loan_received', 'friend_repayment'
  ]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  note: z.string().max(500).optional(),
  payment_mode: z.string().max(50).optional(),
  is_recurring: z.boolean().optional(),
  frequency: z.string().max(50).optional(),
  client_name: z.string().max(100).optional(),
  expected_payout_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
}).strict();

// 3. Expense validation
export const expenseSchema = z.object({
  amount: z.number().positive("Expense amount must be positive").max(10000000),
  category: z.enum([
    'Food & Dining', 'Travel', 'Education', 'Shopping', 'Subscriptions', 
    'Health', 'Housing', 'Social', 'Loans & EMI', 'Investments', 'Miscellaneous'
  ]),
  subcategory: z.string().max(100).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  note: z.string().max(500).optional(),
  payment_mode: z.string().max(50).optional(),
  venue_name: z.string().max(150).optional(),
  tag: z.enum(['need', 'want', 'impulse']).optional(),
  trip_id: z.string().uuid().optional(),
  linked_loan_id: z.string().uuid().optional(),
  is_recurring: z.boolean().optional(),
  frequency: z.string().max(50).optional(),
  location: z.string().max(200).optional(),
  people_count: z.number().int().positive().max(100).optional()
}).strict();

// 4. Trip validation
export const tripSchema = z.object({
  name: z.string().min(2).max(100),
  destination: z.string().max(150).optional(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  total_budget: z.number().nonnegative().max(10000000),
  participants: z.array(z.string().min(2).max(100)),
  notes: z.string().max(1000).optional()
}).strict();

// 5. Loan validation
export const loanSchema = z.object({
  lender_name: z.string().min(2).max(150),
  loan_type: z.string().max(100).optional(),
  principal: z.number().positive().max(50000000),
  interest_rate: z.number().nonnegative().max(100),
  emi_amount: z.number().nonnegative().max(5000000),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().max(1000).optional()
}).strict();

// 6. SIP validation
export const sipSchema = z.object({
  fund_name: z.string().min(2).max(200),
  fund_type: z.string().max(100).optional(),
  monthly_amount: z.number().positive().max(1000000),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  next_payment_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reminder_days_before: z.number().int().min(1).max(30).optional()
}).strict();

// 7. Budget validation
export const budgetSchema = z.object({
  category: z.string().min(2).max(150),
  monthly_limit: z.number().positive().max(10000000),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000).max(2100),
  rollover_enabled: z.boolean().optional()
}).strict();

// 8. Goal validation
export const goalSchema = z.object({
  name: z.string().min(2).max(150),
  target_amount: z.number().positive().max(100000000),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  monthly_contribution: z.number().nonnegative().optional(),
  category: z.string().max(100).optional(),
  icon: z.string().max(50).optional()
}).strict();

// 9. Reminder validation
export const reminderSchema = z.object({
  title: z.string().min(2).max(150),
  amount: z.number().positive().optional(),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  frequency: z.string().max(50).optional(),
  type: z.enum(['sip', 'loan', 'subscription', 'rent', 'recharge', 'exam_fee', 'custom']),
  reminder_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/).optional(),
  autopay: z.boolean().optional()
}).strict();
