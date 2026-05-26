-- ====================================================
-- DATABASE SCHEMA FOR CAPITALS
-- ====================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. USERS
create table public.users (
    id uuid primary key references auth.users(id) on delete cascade,
    name text,
    email text unique,
    college text,
    city text,
    student_type text, -- school, undergraduate, postgraduate, self_taught
    currency text default 'INR',
    monthly_allowance numeric default 0,
    main_income_source text,
    has_loan boolean default false,
    has_sip boolean default false,
    financial_goal text,
    preferred_reminder_time text, -- e.g., "20:00"
    avatar_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.users enable row level security;

create policy "Users can read their own profile" on public.users
    for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.users
    for update using (auth.uid() = id);

create policy "Users can insert their own profile" on public.users
    for insert with check (auth.uid() = id);

-- 2. TRIPS
create table public.trips (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.users(id) on delete cascade not null,
    name text not null,
    destination text,
    start_date date,
    end_date date,
    total_budget numeric default 0,
    participants text[],
    cover_image text,
    notes text,
    status text default 'planned', -- planned, active, completed
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.trips enable row level security;
create policy "Manage own trips" on public.trips for all using (auth.uid() = user_id);

-- 3. GOALS
create table public.goals (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.users(id) on delete cascade not null,
    name text not null,
    target_amount numeric not null,
    saved_amount numeric default 0,
    deadline date,
    monthly_contribution numeric default 0,
    category text,
    status text default 'in_progress', -- in_progress, achieved, paused
    icon text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.goals enable row level security;
create policy "Manage own goals" on public.goals for all using (auth.uid() = user_id);

-- 4. INCOME
create table public.income (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.users(id) on delete cascade not null,
    amount numeric not null check (amount > 0),
    source text not null, -- parent_allowance, pocket_money, freelancing, internship_stipend, part_time_job, scholarship, gift, refund, side_hustle, loan_received, friend_repayment
    date date not null default current_date,
    note text,
    payment_mode text, -- UPI, cash, bank_transfer
    is_recurring boolean default false,
    frequency text, -- weekly, monthly, quarterly
    client_name text,
    expected_payout_date date,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.income enable row level security;
create policy "Manage own income" on public.income for all using (auth.uid() = user_id);

-- 5. LOANS
create table public.loans (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.users(id) on delete cascade not null,
    lender_name text not null, -- mPokket, Slice, KreditBee, friend name, education loan
    loan_type text, -- app, friend, education, bank
    principal numeric not null check (principal > 0),
    interest_rate numeric default 0, -- percent annual
    emi_amount numeric default 0,
    start_date date not null,
    due_date date not null,
    total_paid numeric default 0,
    remaining_balance numeric not null,
    status text default 'active', -- active, paid, overdue
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.loans enable row level security;
create policy "Manage own loans" on public.loans for all using (auth.uid() = user_id);

-- 6. EXPENSES
create table public.expenses (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.users(id) on delete cascade not null,
    amount numeric not null check (amount > 0),
    category text not null, -- Food & Dining, Travel, Education, Shopping, Subscriptions, Health, Housing, Social, Loans & EMI, Investments, Miscellaneous
    subcategory text,
    date date not null default current_date,
    note text,
    payment_mode text, -- UPI, cash, card
    venue_name text,
    tag text, -- need, want, impulse
    trip_id uuid references public.trips(id) on delete set null,
    linked_loan_id uuid references public.loans(id) on delete set null,
    is_recurring boolean default false,
    frequency text,
    receipt_url text,
    location text,
    people_count integer default 1,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.expenses enable row level security;
create policy "Manage own expenses" on public.expenses for all using (auth.uid() = user_id);

-- 7. TRIP_EXPENSES
create table public.trip_expenses (
    id uuid primary key default gen_random_uuid(),
    trip_id uuid references public.trips(id) on delete cascade not null,
    user_id uuid references public.users(id) on delete cascade not null,
    amount numeric not null check (amount > 0),
    category text not null,
    subcategory text,
    description text,
    paid_by text not null,
    split_between text[],
    date date not null default current_date
);

alter table public.trip_expenses enable row level security;
create policy "Manage own trip expenses" on public.trip_expenses for all using (auth.uid() = user_id);

-- 8. SIPS
create table public.sips (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.users(id) on delete cascade not null,
    fund_name text not null, -- mutual fund name, stock name, digital gold
    fund_type text, -- mutual_fund, stock, digital_gold, fixed_deposit
    monthly_amount numeric not null check (monthly_amount > 0),
    start_date date not null,
    next_payment_date date not null,
    total_invested numeric default 0,
    current_value numeric default 0,
    reminder_days_before integer default 3,
    status text default 'active', -- active, paused, inactive
    linked_goal_id uuid references public.goals(id) on delete set null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.sips enable row level security;
create policy "Manage own sips" on public.sips for all using (auth.uid() = user_id);

-- 9. BUDGETS
create table public.budgets (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.users(id) on delete cascade not null,
    category text not null,
    monthly_limit numeric not null check (monthly_limit > 0),
    spent numeric default 0,
    month integer not null check (month >= 1 and month <= 12),
    year integer not null,
    rollover_enabled boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique (user_id, category, month, year)
);

alter table public.budgets enable row level security;
create policy "Manage own budgets" on public.budgets for all using (auth.uid() = user_id);

-- 10. REMINDERS
create table public.reminders (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.users(id) on delete cascade not null,
    title text not null,
    amount numeric,
    due_date date not null,
    frequency text default 'once', -- once, weekly, monthly, yearly
    type text not null, -- sip, loan, subscription, rent, recharge, exam_fee, custom
    status text default 'pending', -- pending, paid, snoozed, overdue
    reminder_time time without time zone default '09:00:00',
    autopay boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.reminders enable row level security;
create policy "Manage own reminders" on public.reminders for all using (auth.uid() = user_id);

-- 11. FRIENDS
create table public.friends (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.users(id) on delete cascade not null,
    friend_name text not null,
    phone text,
    upi_id text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique (user_id, friend_name)
);

alter table public.friends enable row level security;
create policy "Manage own friends" on public.friends for all using (auth.uid() = user_id);

-- 12. SHARED_EXPENSES
create table public.shared_expenses (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.users(id) on delete cascade not null,
    paid_by text not null, -- name/UPI
    amount numeric not null check (amount > 0),
    description text not null,
    split_between text[] not null, -- array of names
    trip_id uuid references public.trips(id) on delete set null,
    date date not null default current_date,
    settled boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.shared_expenses enable row level security;
create policy "Manage own shared expenses" on public.shared_expenses for all using (auth.uid() = user_id);

-- 13. SETTLEMENTS
create table public.settlements (
    id uuid primary key default gen_random_uuid(),
    shared_expense_id uuid references public.shared_expenses(id) on delete cascade not null,
    from_user text not null,
    to_user text not null,
    amount numeric not null check (amount > 0),
    settled_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.settlements enable row level security;
create policy "Manage own settlements" on public.settlements for all using (
    exists (
        select 1 from public.shared_expenses
        where public.shared_expenses.id = public.settlements.shared_expense_id
        and public.shared_expenses.user_id = auth.uid()
    )
);

-- 14. SUBSCRIPTIONS
create table public.subscriptions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.users(id) on delete cascade not null,
    name text not null,
    amount numeric not null check (amount > 0),
    renewal_date date not null,
    frequency text not null default 'monthly', -- monthly, yearly
    category text default 'Entertainment',
    logo_url text,
    shared_with text[], -- array of friend names
    split_ratio numeric[], -- split ratios e.g. [0.5, 0.5]
    status text default 'active', -- active, paused, cancelled
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.subscriptions enable row level security;
create policy "Manage own subscriptions" on public.subscriptions for all using (auth.uid() = user_id);

-- 15. AI_INSIGHTS
create table public.ai_insights (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.users(id) on delete cascade not null,
    message text not null,
    type text default 'info', -- warning, recommendation, safety, achievement
    generated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    dismissed boolean default false
);

alter table public.ai_insights enable row level security;
create policy "Manage own insights" on public.ai_insights for all using (auth.uid() = user_id);


-- ====================================================
-- PERFORMANCE INDEXES
-- ====================================================
create index idx_income_user_date on public.income(user_id, date);
create index idx_expenses_user_date on public.expenses(user_id, date);
create index idx_expenses_user_category on public.expenses(user_id, category);
create index idx_expenses_user_tag on public.expenses(user_id, tag);
create index idx_loans_user_due on public.loans(user_id, due_date);
create index idx_sips_user_next on public.sips(user_id, next_payment_date);
create index idx_budgets_user_date on public.budgets(user_id, month, year);
create index idx_reminders_user_due on public.reminders(user_id, due_date);
create index idx_shared_expenses_user_settled on public.shared_expenses(user_id, settled);


-- ====================================================
-- AUTOMATIC PROFILE TRIGGER ON SIGNUP
-- ====================================================
-- Create trigger function
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, name, email, avatar_url, student_type, monthly_allowance)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'avatar_url',
    'undergraduate', -- default
    0 -- default allowance (set properly during onboarding)
  );
  return new;
end;
$$ language plpgsql security definer;

-- Bind trigger to auth.users
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
