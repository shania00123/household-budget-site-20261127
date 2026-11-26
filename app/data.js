// Worked-example household: the Mendez family (two adults, one child, one
// grandparent) keeping a budget from September to November 2026. Every figure
// on the site is computed from these entries, so nothing is placeholder.
export const CATEGORIES = [
  { id: 'housing', name: 'Housing', kind: 'need', color: '#2e7d4f' },
  { id: 'groceries', name: 'Groceries', kind: 'need', color: '#7aa33c' },
  { id: 'utilities', name: 'Utilities', kind: 'need', color: '#2f5f8f' },
  { id: 'transport', name: 'Transport', kind: 'need', color: '#1f7a72' },
  { id: 'health', name: 'Health', kind: 'need', color: '#b3402e' },
  { id: 'kids', name: 'Kids & school', kind: 'need', color: '#b97a1e' },
  { id: 'dining', name: 'Eating out', kind: 'want', color: '#c46a9e' },
  { id: 'fun', name: 'Fun & streaming', kind: 'want', color: '#6d4a7a' },
  { id: 'shopping', name: 'Shopping', kind: 'want', color: '#8a6d3b' },
  { id: 'other', name: 'Other', kind: 'want', color: '#7a6a58' },
];

export const MONTHS = [
  { id: '2026-09', label: 'September 2026' },
  { id: '2026-10', label: 'October 2026' },
  { id: '2026-11', label: 'November 2026' },
];

function tx(date, label, category, amount, type = 'expense') {
  return { id: `${date}-${label}`.replace(/[^a-z0-9]+/gi, '-').toLowerCase(), date, label, category, amount, type };
}

export const SEED = {
  household: 'The Mendez household — Rosa & Daniel, Lucia (9) and Grandpa Tomás',
  planned: { housing: 1650, groceries: 720, utilities: 260, transport: 240, health: 180, kids: 150, dining: 160, fun: 90, shopping: 180, other: 100 },
  entries: [
    // September
    tx('2026-09-01', 'Rosa salary — clinic', 'income', 3150, 'income'),
    tx('2026-09-01', 'Daniel salary — transit depot', 'income', 2380, 'income'),
    tx('2026-09-02', 'Rent', 'housing', 1650),
    tx('2026-09-03', 'Market basket weekly shop', 'groceries', 168),
    tx('2026-09-05', 'Electricity bill', 'utilities', 96),
    tx('2026-09-07', 'Bus passes x3', 'transport', 135),
    tx('2026-09-09', 'Pharmacy — Tomás', 'health', 64),
    tx('2026-09-10', 'Market basket weekly shop', 'groceries', 154),
    tx('2026-09-12', 'School supplies Lucia', 'kids', 88),
    tx('2026-09-14', 'Family pizza night', 'dining', 57),
    tx('2026-09-16', 'Water + internet', 'utilities', 118),
    tx('2026-09-17', 'Market basket weekly shop', 'groceries', 171),
    tx('2026-09-19', 'Streaming bundle', 'fun', 29),
    tx('2026-09-21', 'Shoes for Lucia', 'shopping', 62),
    tx('2026-09-24', 'Market basket weekly shop', 'groceries', 149),
    tx('2026-09-26', 'Fuel top-up', 'transport', 58),
    tx('2026-09-28', 'Dentist check-up', 'health', 85),
    tx('2026-09-30', 'Side tutoring income', 'income', 240, 'income'),
    // October
    tx('2026-10-01', 'Rosa salary — clinic', 'income', 3150, 'income'),
    tx('2026-10-01', 'Daniel salary — transit depot', 'income', 2380, 'income'),
    tx('2026-10-02', 'Rent', 'housing', 1650),
    tx('2026-10-04', 'Market basket weekly shop', 'groceries', 176),
    tx('2026-10-06', 'Electricity bill', 'utilities', 104),
    tx('2026-10-08', 'Bus passes x3', 'transport', 135),
    tx('2026-10-11', 'Market basket weekly shop', 'groceries', 162),
    tx('2026-10-13', 'Flu shots x4', 'health', 72),
    tx('2026-10-15', 'School trip fee', 'kids', 45),
    tx('2026-10-17', 'Anniversary dinner', 'dining', 118),
    tx('2026-10-18', 'Market basket weekly shop', 'groceries', 158),
    tx('2026-10-20', 'Water + internet', 'utilities', 121),
    tx('2026-10-22', 'Winter coats (sale)', 'shopping', 143),
    tx('2026-10-24', 'Cinema family matinee', 'fun', 48),
    tx('2026-10-25', 'Market basket weekly shop', 'groceries', 167),
    tx('2026-10-27', 'Car service deposit', 'transport', 210),
    tx('2026-10-30', 'Side tutoring income', 'income', 240, 'income'),
    // November
    tx('2026-11-01', 'Rosa salary — clinic', 'income', 3150, 'income'),
    tx('2026-11-01', 'Daniel salary — transit depot', 'income', 2380, 'income'),
    tx('2026-11-02', 'Rent', 'housing', 1650),
    tx('2026-11-03', 'Market basket weekly shop', 'groceries', 172),
    tx('2026-11-05', 'Electricity bill', 'utilities', 112),
    tx('2026-11-07', 'Bus passes x3', 'transport', 135),
    tx('2026-11-09', 'Pharmacy — Tomás', 'health', 58),
    tx('2026-11-10', 'Market basket weekly shop', 'groceries', 165),
    tx('2026-11-12', 'Book fair Lucia', 'kids', 36),
    tx('2026-11-14', 'Takeaway Friday', 'dining', 64),
    tx('2026-11-15', 'School shoes + winter gloves', 'shopping', 74),
    tx('2026-11-17', 'Market basket weekly shop', 'groceries', 159),
    tx('2026-11-19', 'Water + internet', 'utilities', 119),
    tx('2026-11-20', 'Board-game night snacks', 'dining', 38),
    tx('2026-11-21', 'Streaming bundle', 'fun', 29),
    tx('2026-11-22', 'Music lesson Lucia', 'kids', 60),
    tx('2026-11-23', 'Gift wrapping + cards', 'shopping', 41),
    tx('2026-11-24', 'Market basket weekly shop', 'groceries', 170),
    tx('2026-11-25', 'Household supplies restock', 'other', 47),
    tx('2026-11-26', 'Side tutoring income', 'income', 240, 'income'),
    tx('2026-11-27', 'Birthday gift for cousin', 'shopping', 55),
  ],
  goals: [
    { id: 'emergency', name: 'Emergency fund', target: 9000, saved: 6420, monthly: 400, note: 'Three months of essentials for four people.' },
    { id: 'car', name: 'Car replacement', target: 6000, saved: 2150, monthly: 250, note: 'Replace the 2014 hatchback before inspection in June.' },
    { id: 'trip', name: 'Family trip — coast', target: 1800, saved: 1175, monthly: 150, note: 'Four nights, train fares and a small apartment.' },
    { id: 'braces', name: 'Lucia braces fund', target: 2400, saved: 640, monthly: 120, note: 'Orthodontist quote, paid in instalments from March.' },
  ],
  bills: [
    { name: 'Rent', amount: 1650, due: '2026-12-02', category: 'housing' },
    { name: 'Electricity (estimate)', amount: 118, due: '2026-12-05', category: 'utilities' },
    { name: 'Bus passes x3', amount: 135, due: '2026-12-07', category: 'transport' },
    { name: 'Water + internet', amount: 121, due: '2026-12-19', category: 'utilities' },
    { name: 'Home insurance quarterly', amount: 214, due: '2026-12-28', category: 'housing' },
  ],
  debts: [
    { name: 'Store card', balance: 840, apr: 22.9, minPay: 35 },
    { name: 'Credit union loan', balance: 3200, apr: 9.4, minPay: 95 },
  ],
};
