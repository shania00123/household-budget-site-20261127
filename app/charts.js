// Inline SVG charts built from the ledger numbers — no images, no network.
import { categoryColor, money } from './store.js';

export function donutChart(rows, size = 190) {
  const total = rows.reduce((s, r) => s + r.spent, 0) || 1;
  const r = 70;
  const c = 2 * Math.PI * r;
  let offset = 0;
  const arcs = rows.filter((row) => row.spent > 0).map((row) => {
    const frac = row.spent / total;
    const dash = `${(frac * c).toFixed(1)} ${c.toFixed(1)}`;
    const el = `<circle cx="95" cy="95" r="${r}" fill="none" stroke="${categoryColor(row.id)}" stroke-width="26" stroke-dasharray="${dash}" stroke-dashoffset="${(-offset * c).toFixed(1)}" transform="rotate(-90 95 95)"><title>${row.name}: ${money(row.spent)}</title></circle>`;
    offset += frac;
    return el;
  }).join('');
  return `<svg viewBox="0 0 190 190" width="${size}" height="${size}" role="img" aria-label="Spending by category, total ${money(total)}">${arcs}<text x="95" y="90" text-anchor="middle" font-size="15" font-weight="bold" fill="#2b2118">${money(total)}</text><text x="95" y="110" text-anchor="middle" font-size="11" fill="#7a6a58">spent</text></svg>`;
}

export function monthBars(series) {
  const max = Math.max(...series.flatMap((s) => [s.income, s.spent]), 1);
  const w = 460;
  const h = 190;
  const bw = 34;
  const gap = (w - series.length * bw * 2) / (series.length + 1);
  let x = gap;
  const bars = series.map((s) => {
    const ih = Math.round((s.income / max) * 130);
    const sh = Math.round((s.spent / max) * 130);
    const out = `<rect x="${x}" y="${150 - ih}" width="${bw}" height="${ih}" rx="4" fill="#2e7d4f"><title>${s.label} income ${money(s.income)}</title></rect>`
      + `<rect x="${x + bw + 3}" y="${150 - sh}" width="${bw}" height="${sh}" rx="4" fill="#b97a1e"><title>${s.label} spent ${money(s.spent)}</title></rect>`
      + `<text x="${x + bw}" y="168" text-anchor="middle" font-size="11" fill="#55452f">${s.short}</text>`
      + `<text x="${x + bw}" y="183" text-anchor="middle" font-size="10" fill="#7a6a58">saved ${money(s.saved)}</text>`;
    x += bw * 2 + gap;
    return out;
  }).join('');
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="Income against spending by month"><line x1="0" y1="150" x2="${w}" y2="150" stroke="#e7dcc8"/>${bars}</svg><p class="stat-note"><span class="pill good">income</span> <span class="pill warn">spending</span></p>`;
}

export function progressBar(done, total) {
  const p = total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0;
  const cls = p >= 100 ? '' : p >= 80 ? 'near' : '';
  return `<div class="bar" role="progressbar" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100"><i class="${cls}" style="width:${p}%"></i></div>`;
}
