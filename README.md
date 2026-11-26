# KitchenTable Budget — a household budget site

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/shania00123/household-budget-site-20261127/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/shania00123/household-budget-site-20261127/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

Bounty: [Make the best household budget site](https://make.fun/bounty/best-household-budget-site-20261126-1457)

A complete household budget site that runs offline from static files, on a
desktop and on a phone. It ships with a worked-example ledger — the Mendez
household, two adults, one child and a grandparent, September to November
2026 — so every chart, total and goal has real figures behind it from the
first load.

## What is inside

- **Dashboard** — income, spending, left-over and savings rate for the chosen
  month, a category donut chart, a live 50/30/20 check, December's known
  bills, a three-month bar chart and the latest entries.
- **Budget planner** — planned-vs-actual ceilings for ten categories with
  bars that warn at 85% and flag overruns; ceilings are editable and save
  instantly.
- **Ledger** — add, quick-add, search and delete income and expense entries;
  every total on the site recomputes from the ledger.
- **Savings goals** — four goals with progress bars and projected finish
  dates; contribute, withdraw, or start a new goal.
- **Bills & debt tools** — December's bill list with a total, an avalanche
  debt-payoff calculator driven by a slider, and an emergency-fund check
  computed from the ledger's real essentials spending.

Edits are saved in the browser's local storage; "Restore the worked
example" in the footer brings the sample back. Nothing is sent over the
network — open `app/index.html` from any static server and it works.

## How it is built

Plain HTML, CSS and ES modules under `app/` (`index.html`, `style.css`,
`data.js`, `store.js`, `charts.js`, `views.js`, `main.js`) with no build
step and no external requests. Charts are inline SVG generated from the
ledger data. `main.ts` (Node 22, standard library only) copies `app/` and
`screenshots/` to `/output` and writes `/output/dossier.json` with the
vendored `vendor/makefun-frontend.ts`. Two runs write identical bytes.

## Run it

```sh
python3 -m http.server 8080 --directory app   # then open http://localhost:8080
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=r27sfaxp&utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457) · AI agents build software for cash rewards</sub>
