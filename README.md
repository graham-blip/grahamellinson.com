# Graham Ellinson — Portfolio & CV

A fast, dependency-free personal site (the **"Quant Terminal"** dark theme) plus a clean,
print-perfect CV with a downloadable PDF. Pure HTML/CSS/JS — no build step — so it deploys
straight to **GitHub Pages**.

```
graham-portfolio/
├── index.html                     # interactive single-page site
├── cv.html                        # print-perfect CV (View CV online)
├── assets/
│   ├── css/style.css              # site design system
│   ├── css/cv.css                 # CV styles (screen + print)
│   ├── js/main.js                 # interactions (no libraries)
│   └── cv/Graham-Ellinson-CV.pdf  # downloadable CV PDF
├── .nojekyll                      # serve /assets as-is on GitHub Pages
└── README.md
```

---

## ✅ Before you publish — quick checks

Real contact details are already in (email `ellinsong@gmail.com`, phone, LinkedIn, GitHub
`graham-blip`, education, dates). Just confirm:

| Check | Why |
|---|---|
| **GitHub handle** — site links `github.com/graham-blip` | Confirm this matches your account (verify with `gh api user`). Search-replace if different. |
| **No deep repo links** | Internal projects are **not** linked — they're private/confidential. The site only links your GitHub **profile**. |
| **DeFi is deliberately vague** | The tokenization/DeFi work is described generically (mint/burn, Solidity, liquidation bots, MEV-resistance) — no product names, lending protocols, custody models. Keep it that way until launch. |
| **Confidentiality** | All eToro work is high-level — no dollar figures, counterparty names, internal system names or colleague names. |

If you edit `cv.html`, **regenerate the PDF** (see below) so the download matches.

---

## Run locally

Just open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Regenerate the CV PDF after editing `cv.html`

Headless Chrome (or Edge) renders the print stylesheet to PDF:

```bash
# Chrome
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu \
  --no-pdf-header-footer --run-all-compositor-stages-before-draw --virtual-time-budget=6000 \
  --print-to-pdf="assets/cv/Graham-Ellinson-CV.pdf" "file://$PWD/cv.html"
```

(Or just open `cv.html` and use **Print / Save as PDF** — the toolbar button does this.)

---

## Deploy to GitHub Pages — `graham-blip` user site, custom domain `grahamellinson.com`

This replaces the old CV page at `graham-blip.github.io` with this site.

```bash
gh auth login                       # log in to the graham-blip account
gh api user --jq .login             # confirm the username

# point this folder's git at the user-site repo (create it if missing)
git remote add origin https://github.com/graham-blip/graham-blip.github.io.git
git push -u origin main             # (force-replaces old CV content if the repo already exists)
```

Then: **Settings → Pages** → Source = `main` / `/ (root)`. The user site is served at
`https://graham-blip.github.io/`.

### Custom domain `grahamellinson.com`
1. Add a `CNAME` file at the repo root containing `grahamellinson.com`.
2. DNS for the apex domain → four GitHub A records: `185.199.108.153`, `.109.153`,
   `.110.153`, `.111.153` (and a `www` CNAME → `graham-blip.github.io`).
3. **Settings → Pages → Custom domain** = `grahamellinson.com`, then enable **Enforce HTTPS**.

All asset paths are **relative**, so it works on `graham-blip.github.io` and the custom domain alike.

---

## Content note

This is a **public** page. All eToro work is described at a deliberately high level —
no dollar figures, counterparty names, internal system names, or colleague names. Keep it that way.
