// Page renderers: each returns the HTML for one hash route, built from the
// store's computed figures so screenshots always show real numbers.
import { donutChart, monthBars, progressBar } from './charts.js';
import {
  categories, categoryName, categorySpend, debtPlan, essentialsMonthly, getState,
  goalFinish, money, monthEntries, months, monthTotals, needsWants, pct,
} from './store.js';

function esc(text) {
  return String(text).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
}

function monthLabel(monthId) {
  const found = months().find((m) => m.id === monthId);
  return found ? found.label : monthId;
}

export function dashboardView(monthId) {
  const totals = monthTotals(monthId);
  const cats = categorySpend(monthId);
  const split = needsWants(monthId);
  const state = getState();
  const series = months().map((m) => ({ ...monthTotals(m.id), label: m.label, short: m.label.slice(0, 3) }));
  const recent = monthEntries(monthId).slice(-6).reverse();
  const topCats = cats.filter((c) => c.spent > 0).slice(0, 6);
  const billsTotal = state.bills.reduce((s, b) => s + b.amount, 0);
  const ratePill = totals.rate >= 20 ? '<span class="pill good">at the 20% savings mark</span>'
    : totals.rate >= 10 ? '<span class="pill warn">building toward 20%</span>' : '<span class="pill bad">below 10% — trim wants</span>';
  return `
  <section class="hero">
    <h1>${esc(state.household)}</h1>
    <p>${monthLabel(monthId)} at a glance: what came in, what went out, and what is left for the goals below. Every figure is worked out from the ledger — open the <a href="#ledger">ledger</a> to see the entries behind them.</p>
  </section>
  <div class="grid stats">
    <div class="card"><div class="stat-label">Income</div><div class="stat-num">${money(totals.income)}</div><div class="stat-note">two salaries + tutoring</div></div>
    <div class="card"><div class="stat-label">Spending</div><div class="stat-num">${money(totals.spent)}</div><div class="stat-note">${pct(totals.spent, totals.income)}% of income</div></div>
    <div class="card"><div class="stat-label">Left over</div><div class="stat-num ${totals.saved >= 0 ? 'good' : 'bad'}">${money(totals.saved)}</div><div class="stat-note">before goal contributions</div></div>
    <div class="card"><div class="stat-label">Savings rate</div><div class="stat-num">${totals.rate}%</div><div class="stat-note">${ratePill}</div></div>
  </div>
  <div class="grid two">
    <div class="card">
      <h2>Where the money went</h2>
      <div class="donutwrap">${donutChart(cats)}
        <ul class="legend">${topCats.map((c) => `<li><span style="color:${c.color}">■</span> ${c.name} — <strong>${money(c.spent)}</strong> (${pct(c.spent, totals.spent)}%)</li>`).join('')}</ul>
      </div>
      <p class="stat-note">Housing is the largest single cost; groceries run second. Compare with the plan on the <a href="#budget">budget planner</a>.</p>
    </div>
    <div class="card">
      <h2>50 / 30 / 20 check</h2>
      <div class="kv"><span>Needs (aim ≤ 50%)</span><strong>${money(split.needs)} · ${pct(split.needs, split.income)}%</strong></div>
      <div class="kv"><span>Wants (aim ≤ 30%)</span><strong>${money(split.wants)} · ${pct(split.wants, split.income)}%</strong></div>
      <div class="kv"><span>Savings (aim ≥ 20%)</span><strong>${money(split.savings)} · ${pct(split.savings, split.income)}%</strong></div>
      <p class="stat-note">Rent alone is ${pct(1650, split.income)}% of income, so needs run hot; the household keeps wants lean to protect the savings share.</p>
      <h3>December bills already known: ${money(billsTotal)}</h3>
      ${state.bills.map((b) => `<div class="kv"><span>${esc(b.name)} · due ${b.due.slice(8)} Dec</span><strong>${money(b.amount)}</strong></div>`).join('')}
    </div>
  </div>
  <div class="grid two">
    <div class="card"><h2>Three months side by side</h2>${monthBars(series)}</div>
    <div class="card">
      <h2>Latest entries</h2>
      <table><thead><tr><th>Date</th><th>Entry</th><th class="num">Amount</th></tr></thead><tbody>
      ${recent.map((e) => `<tr><td>${e.date.slice(5)}</td><td>${esc(e.label)}<br><span class="stat-note">${categoryName(e.category)}</span></td><td class="num ${e.type === 'income' ? 'good' : ''}">${e.type === 'income' ? '+' : '−'}${money(e.amount)}</td></tr>`).join('')}
      </tbody></table>
      <p><a class="btn small" href="#ledger">Open the full ledger</a> <a class="btn small ghost" href="#goals">See savings goals</a></p>
    </div>
  </div>`;
}

export function budgetView(monthId) {
  const cats = categorySpend(monthId);
  const totals = monthTotals(monthId);
  const plannedTotal = cats.reduce((s, c) => s + c.planned, 0);
  const rows = cats.map((c) => {
    const p = c.planned > 0 ? Math.round((c.spent / c.planned) * 100) : 0;
    const cls = p > 100 ? 'over' : p >= 85 ? 'near' : '';
    const status = p > 100 ? `<span class="pill bad">${money(c.spent - c.planned)} over</span>`
      : p >= 85 ? '<span class="pill warn">nearly full</span>' : '<span class="pill good">on track</span>';
    return `<div class="catrow"><span><strong>${c.name}</strong><br><span class="stat-note">${c.kind === 'need' ? 'need' : 'want'}</span></span>
      <span><span class="bar"><i class="${cls}" style="width:${Math.min(100, p)}%"></i></span><span class="stat-note">${p}% of plan</span></span>
      <span class="num">${money(c.spent)} / ${money(c.planned)}<br>${status}</span></div>`;
  }).join('');
  const editors = cats.map((c) => `<label class="f">${c.name} ceiling ($)<input type="number" min="0" step="10" value="${c.planned}" data-plan="${c.id}"></label>`).join('');
  return `
  <section class="hero"><h1>Budget planner — ${monthLabel(monthId)}</h1>
  <p>Planned ceilings total ${money(plannedTotal)} against ${money(totals.income)} of income, leaving ${money(totals.income - plannedTotal)} of planned headroom for goals and debt. Bars turn amber at 85% and red past the ceiling.</p></section>
  <div class="grid two">
    <div class="card"><h2>Planned vs actual</h2>${rows}
      <p class="stat-note">Actual spending so far: ${money(totals.spent)} of ${money(plannedTotal)} planned (${pct(totals.spent, plannedTotal)}%).</p></div>
    <div class="card"><h2>Adjust the ceilings</h2>
      <div class="grid" style="grid-template-columns:1fr 1fr;gap:.6rem">${editors}</div>
      <p class="stat-note">Changes save instantly and the bars above redraw. A good first move when a category runs over: shift the ceiling, not the goal contribution.</p>
      <div class="note">Rule of thumb used here: needs under 50% of income, wants under 30%, savings at least 20%. This household's rent pushes needs to ${pct(needsWants(monthId).needs, totals.income)}%, so wants are planned tighter.</div>
    </div>
  </div>`;
}

export function ledgerView(monthId, filter = '') {
  const rows = monthEntries(monthId).filter((e) => !filter || `${e.label} ${categoryName(e.category)}`.toLowerCase().includes(filter.toLowerCase()));
  const totals = monthTotals(monthId);
  const catOptions = categories().map((c) => `<option value="${c.id}">${c.name}</option>`).join('');
  return `
  <section class="hero"><h1>Ledger — ${monthLabel(monthId)}</h1>
  <p>${rows.length} entries shown · income ${money(totals.income)} · spending ${money(totals.spent)} · left over ${money(totals.saved)}. Add an entry and every total on the site updates.</p></section>
  <div class="card" style="margin-top:1rem"><h2>Add an entry</h2>
    <form class="add" id="addEntry">
      <label class="f">What was it?<input type="text" name="label" required placeholder="e.g. Pharmacy"></label>
      <label class="f">Amount ($)<input type="number" name="amount" min="1" step="1" required placeholder="42"></label>
      <label class="f">Category<select name="category">${catOptions}<option value="income">Income</option></select></label>
      <label class="f">Date<input type="date" name="date" value="${monthId}-15" required></label>
      <button class="btn" type="submit">Add entry</button>
    </form>
    <div class="chips" aria-label="Quick add">
      <button type="button" class="chip" data-quick="groceries|Market basket weekly shop|165">Weekly groceries $165</button>
      <button type="button" class="chip" data-quick="transport|Bus passes x3|135">Bus passes $135</button>
      <button type="button" class="chip" data-quick="dining|Takeaway Friday|64">Takeaway $64</button>
      <button type="button" class="chip" data-quick="income|Side tutoring income|240">Tutoring income $240</button>
    </div>
    <label class="f" style="max-width:320px">Search entries<input type="text" id="ledgerSearch" value="${esc(filter)}" placeholder="rent, pharmacy, school…"></label>
  </div>
  <div class="card" style="margin-top:1rem"><h2>Entries</h2>
    <table><thead><tr><th>Date</th><th>Entry</th><th>Category</th><th class="num">Amount</th><th></th></tr></thead><tbody>
    ${rows.map((e) => `<tr><td>${e.date}</td><td>${esc(e.label)}</td><td>${categoryName(e.category)}</td><td class="num ${e.type === 'income' ? 'good' : ''}">${e.type === 'income' ? '+' : '−'}${money(e.amount)}</td><td><button type="button" class="btn small ghost" data-del="${e.id}">Delete</button></td></tr>`).join('') || '<tr><td colspan="5">No entries match that search.</td></tr>'}
    </tbody></table></div>`;
}

export function goalsView(monthId) {
  const state = getState();
  const essentials = essentialsMonthly(monthId);
  const cards = state.goals.map((g) => {
    const p = pct(g.saved, g.target);
    return `<div class="goal"><div class="spread"><h3>${esc(g.name)}</h3><span class="pill ${p >= 100 ? 'good' : 'info'}">${p}%</span></div>
      <p class="stat-note">${esc(g.note)}</p>${progressBar(g.saved, g.target)}
      <div class="kv"><span>Saved</span><strong>${money(g.saved)} of ${money(g.target)}</strong></div>
      <div class="kv"><span>Monthly</span><strong>${money(g.monthly)}</strong></div>
      <div class="kv"><span>Projected finish</span><strong>${goalFinish(g)}</strong></div>
      <div class="flex" style="margin-top:.5rem"><button type="button" class="btn small" data-goal-add="${g.id}">Add $50</button><button type="button" class="btn small ghost" data-goal-sub="${g.id}">Take $50</button></div></div>`;
  }).join('');
  const totalMonthly = state.goals.reduce((s, g) => s + g.monthly, 0);
  const emergency = state.goals.find((g) => g.id === 'emergency');
  const cover = essentials > 0 ? (emergency.saved / essentials).toFixed(1) : '0';
  return `
  <section class="hero"><h1>Savings goals</h1>
  <p>The household puts ${money(totalMonthly)} a month toward four goals. The emergency fund currently covers ${cover} months of essentials (${money(essentials)} a month in ${monthLabel(monthId)}); the target is three months.</p></section>
  <div class="grid two" style="margin-top:1rem">${cards}</div>
  <div class="card" style="margin-top:1rem"><h2>Start a new goal</h2>
    <form class="add" id="addGoal">
      <label class="f">Goal name<input type="text" name="name" required placeholder="e.g. New washing machine"></label>
      <label class="f">Target ($)<input type="number" name="target" min="10" step="10" required placeholder="900"></label>
      <label class="f">Monthly ($)<input type="number" name="monthly" min="5" step="5" required placeholder="75"></label>
      <span></span><button class="btn" type="submit">Add goal</button>
    </form>
    <p class="stat-note">Order that works: emergency fund first, then the highest-APR debt, then everything else. The <a href="#tools">debt tool</a> shows why.</p></div>`;
}

export function toolsView(monthId, extra = 100) {
  const state = getState();
  const plan = debtPlan(extra);
  const base = debtPlan(0);
  const essentials = essentialsMonthly(monthId);
  const emergency = state.goals.find((g) => g.id === 'emergency');
  const billsTotal = state.bills.reduce((s, b) => s + b.amount, 0);
  const totals = monthTotals(monthId);
  const debtRows = state.debts.map((d) => `<tr><td>${esc(d.name)}</td><td class="num">${money(d.balance)}</td><td class="num">${d.apr}%</td><td class="num">${money(d.minPay)}</td></tr>`).join('');
  const savedInterest = base.interest - plan.interest;
  return `
  <section class="hero"><h1>Bills &amp; debt tools</h1>
  <p>December's known bills come to ${money(billsTotal)} against ${money(totals.income)} of monthly income. The debt tool pays the highest APR first — the store card at 22.9% is the expensive one.</p></section>
  <div class="grid two">
    <div class="card"><h2>Debt payoff calculator</h2>
      <table><thead><tr><th>Debt</th><th class="num">Balance</th><th class="num">APR</th><th class="num">Minimum</th></tr></thead><tbody>${debtRows}</tbody></table>
      <label class="f" style="margin-top:.7rem">Extra payment each month: <strong id="extraLabel">${money(extra)}</strong>
      <input type="range" id="extraRange" min="0" max="400" step="25" value="${extra}"></label>
      <div class="kv"><span>Debt-free in</span><strong>${plan.months} months</strong></div>
      <div class="kv"><span>Total interest paid</span><strong>${money(plan.interest)}</strong></div>
      <div class="kv"><span>Interest saved vs minimums only</span><strong class="good">${money(Math.max(0, savedInterest))}</strong></div>
      <p class="stat-note">Minimums only would take ${base.months} months and cost ${money(base.interest)} in interest. Drag the slider and watch the finish date move.</p>
    </div>
    <div class="card"><h2>December bills</h2>
      ${state.bills.map((b) => `<div class="kv"><span>${esc(b.name)}<br><span class="stat-note">due ${b.due} · ${categoryName(b.category)}</span></span><strong>${money(b.amount)}</strong></div>`).join('')}
      <div class="kv"><span><strong>Total known</strong></span><strong>${money(billsTotal)}</strong></div>
      <h3>Emergency-fund check</h3>
      <p>Essentials in ${monthLabel(monthId)}: ${money(essentials)}. Emergency fund: ${money(emergency.saved)} — ${(emergency.saved / essentials).toFixed(1)} months covered. At ${money(emergency.monthly)} a month it reaches the three-month mark (${money(essentials * 3)}) by ${goalFinish({ ...emergency, target: Math.round(essentials * 3) })}.</p>
      <div class="warnbox">December also brings the quarterly home-insurance bill (${money(214)}). Setting aside ${money(Math.round(214 / 3))} a month from January smooths it out.</div>
    </div>
  </div>`;
}
