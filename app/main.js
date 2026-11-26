// Router and event wiring: hash routes render the views, forms and buttons
// write through the store and re-render so totals never go stale.
import { budgetView, dashboardView, goalsView, ledgerView, toolsView } from './views.js';
import {
  addEntry, addGoal, contributeGoal, months, removeEntry, resetSample, setPlanned,
} from './store.js';

const app = document.getElementById('app');
const monthPick = document.getElementById('monthPick');
let monthId = '2026-11';
let ledgerFilter = '';
let debtExtra = 100;

for (const m of months()) {
  const opt = document.createElement('option');
  opt.value = m.id;
  opt.textContent = m.label;
  monthPick.appendChild(opt);
}
monthPick.value = monthId;
monthPick.addEventListener('change', () => {
  monthId = monthPick.value;
  render();
});

document.getElementById('resetSample').addEventListener('click', () => {
  resetSample();
  render();
});

function route() {
  const name = location.hash.replace('#', '') || 'dashboard';
  return ['dashboard', 'budget', 'ledger', 'goals', 'tools'].includes(name) ? name : 'dashboard';
}

function render() {
  const name = route();
  document.querySelectorAll('[data-nav]').forEach((a) => {
    a.classList.toggle('active', a.dataset.nav === name);
  });
  if (name === 'budget') app.innerHTML = budgetView(monthId);
  else if (name === 'ledger') app.innerHTML = ledgerView(monthId, ledgerFilter);
  else if (name === 'goals') app.innerHTML = goalsView(monthId);
  else if (name === 'tools') app.innerHTML = toolsView(monthId, debtExtra);
  else app.innerHTML = dashboardView(monthId);
  wire(name);
}

function wire(name) {
  if (name === 'budget') {
    app.querySelectorAll('[data-plan]').forEach((input) => {
      input.addEventListener('change', () => {
        setPlanned(input.dataset.plan, Number(input.value));
        render();
      });
    });
  }
  if (name === 'ledger') {
    const form = document.getElementById('addEntry');
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const data = new FormData(form);
      const category = String(data.get('category'));
      addEntry({
        label: String(data.get('label')).trim(),
        amount: Math.max(1, Math.round(Number(data.get('amount')))),
        category,
        date: String(data.get('date')),
        type: category === 'income' ? 'income' : 'expense',
      });
      render();
    });
    app.querySelectorAll('[data-quick]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const [category, label, amount] = btn.dataset.quick.split('|');
        addEntry({ label, amount: Number(amount), category, date: `${monthId}-15`, type: category === 'income' ? 'income' : 'expense' });
        render();
      });
    });
    app.querySelectorAll('[data-del]').forEach((btn) => {
      btn.addEventListener('click', () => {
        removeEntry(btn.dataset.del);
        render();
      });
    });
    const search = document.getElementById('ledgerSearch');
    search.addEventListener('input', () => {
      ledgerFilter = search.value;
      const pos = search.selectionStart;
      render();
      const again = document.getElementById('ledgerSearch');
      again.focus();
      again.setSelectionRange(pos, pos);
    });
  }
  if (name === 'goals') {
    app.querySelectorAll('[data-goal-add]').forEach((btn) => {
      btn.addEventListener('click', () => { contributeGoal(btn.dataset.goalAdd, 50); render(); });
    });
    app.querySelectorAll('[data-goal-sub]').forEach((btn) => {
      btn.addEventListener('click', () => { contributeGoal(btn.dataset.goalSub, -50); render(); });
    });
    document.getElementById('addGoal').addEventListener('submit', (ev) => {
      ev.preventDefault();
      const data = new FormData(ev.target);
      addGoal(String(data.get('name')).trim(), Math.round(Number(data.get('target'))), Math.round(Number(data.get('monthly'))));
      render();
    });
  }
  if (name === 'tools') {
    const range = document.getElementById('extraRange');
    range.addEventListener('input', () => {
      debtExtra = Number(range.value);
      render();
      document.getElementById('extraRange').focus();
    });
  }
}

window.addEventListener('hashchange', render);
render();
