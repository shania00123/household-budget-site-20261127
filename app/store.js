// State and money maths: loads the worked example, keeps edits in
// localStorage, and computes every total the pages display.
import { CATEGORIES, MONTHS, SEED } from './data.js';

const KEY = 'kitchentable-budget-v1';
let state = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* storage unavailable: fall through to the seed */ }
  return structuredClone(SEED);
}

export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* keep in memory */ }
}

export function resetSample() {
  state = structuredClone(SEED);
  save();
}

export function getState() { return state; }
export function categories() { return CATEGORIES; }
export function months() { return MONTHS; }
export function categoryName(id) {
  if (id === 'income') return 'Income';
  const found = CATEGORIES.find((c) => c.id === id);
  return found ? found.name : id;
}
export function categoryColor(id) {
  const found = CATEGORIES.find((c) => c.id === id);
  return found ? found.color : '#7a6a58';
}
export function money(n) {
  const sign = n < 0 ? '-' : '';
  return `${sign}$${Math.abs(Math.round(n)).toLocaleString('en-US')}`;
}
export function pct(part, whole) {
  return whole > 0 ? Math.round((part / whole) * 100) : 0;
}

export function monthEntries(monthId) {
  return state.entries.filter((e) => e.date.startsWith(monthId)).sort((a, b) => a.date.localeCompare(b.date));
}

export function monthTotals(monthId) {
  const rows = monthEntries(monthId);
  const income = rows.filter((e) => e.type === 'income').reduce((s, e) => s + e.amount, 0);
  const spent = rows.filter((e) => e.type !== 'income').reduce((s, e) => s + e.amount, 0);
  const saved = income - spent;
  return { income, spent, saved, rate: pct(saved, income) };
}

export function categorySpend(monthId) {
  const totals = new Map(CATEGORIES.map((c) => [c.id, 0]));
  for (const e of monthEntries(monthId)) {
    if (e.type !== 'income') totals.set(e.category, (totals.get(e.category) ?? 0) + e.amount);
  }
  return CATEGORIES.map((c) => ({
    ...c,
    spent: totals.get(c.id) ?? 0,
    planned: state.planned[c.id] ?? 0,
  })).sort((a, b) => b.spent - a.spent);
}

export function needsWants(monthId) {
  const cats = categorySpend(monthId);
  const { income } = monthTotals(monthId);
  const needs = cats.filter((c) => c.kind === 'need').reduce((s, c) => s + c.spent, 0);
  const wants = cats.filter((c) => c.kind === 'want').reduce((s, c) => s + c.spent, 0);
  return { needs, wants, savings: income - needs - wants, income };
}

export function essentialsMonthly(monthId) {
  return categorySpend(monthId).filter((c) => c.kind === 'need').reduce((s, c) => s + c.spent, 0);
}

export function addEntry(entry) {
  state.entries.push({ ...entry, id: `u${Date.now().toString(36)}` });
  save();
}

export function removeEntry(id) {
  state.entries = state.entries.filter((e) => e.id !== id);
  save();
}

export function setPlanned(categoryId, amount) {
  state.planned[categoryId] = Math.max(0, Math.round(amount) || 0);
  save();
}

export function contributeGoal(id, amount) {
  const goal = state.goals.find((g) => g.id === id);
  if (!goal) return;
  goal.saved = Math.min(goal.target, Math.max(0, goal.saved + amount));
  save();
}

export function addGoal(name, target, monthly) {
  state.goals.push({ id: `g${Date.now().toString(36)}`, name, target, saved: 0, monthly, note: 'New household goal.' });
  save();
}

export function goalFinish(goal) {
  const left = Math.max(0, goal.target - goal.saved);
  if (left === 0) return 'Funded';
  if (!goal.monthly) return 'No monthly amount set';
  const monthsLeft = Math.ceil(left / goal.monthly);
  const date = new Date(2026, 10 + monthsLeft, 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

// Debt payoff: simulate monthly payments, highest APR first (avalanche).
export function debtPlan(extra) {
  const debts = state.debts.map((d) => ({ ...d }));
  let months = 0;
  let interest = 0;
  const minimums = debts.reduce((s, d) => s + d.minPay, 0);
  while (debts.some((d) => d.balance > 0.5) && months < 600) {
    months += 1;
    let pool = minimums + extra;
    for (const d of debts) {
      if (d.balance <= 0) continue;
      const due = d.balance * (d.apr / 100 / 12);
      interest += due;
      d.balance += due;
    }
    const ordered = debts.filter((d) => d.balance > 0).sort((a, b) => b.apr - a.apr);
    for (const d of ordered) {
      const pay = Math.min(d.balance, Math.max(d.minPay, pool));
      d.balance -= pay;
      pool -= pay;
      if (pool <= 0) break;
    }
  }
  return { months, interest: Math.round(interest), minimums };
}
