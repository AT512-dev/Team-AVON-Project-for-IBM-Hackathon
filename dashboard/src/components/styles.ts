export const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes rowIn { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── DARK MODE (default) ───────────────────────────────────────── */
  .dashboard-root {
    --bg-base:          #050508;
    --bg-card:          rgba(255,255,255,0.02);
    --bg-card-hover:    rgba(255,255,255,0.04);
    --bg-nav:           rgba(5,5,8,0.85);
    --bg-hero:          transparent;
    --bg-input:         rgba(255,255,255,0.03);
    --bg-badge:         rgba(239,68,68,0.12);

    --border-card:      rgba(255,255,255,0.07);
    --border-card-sub:  rgba(255,255,255,0.06);
    --border-input:     rgba(255,255,255,0.08);
    --border-divider:   rgba(255,255,255,0.08);

    --text-primary:     #ffffff;
    --text-secondary:   #e2e8f0;
    --text-muted:       #6b7280;
    --text-faint:       #4b5563;
    --text-code:        #93c5fd;

    --grid-line:        rgba(99,102,241,0.03);

    --badge-error-bg:   rgba(239,68,68,0.12);
    --badge-error-text: #f87171;
    --badge-error-border: rgba(239,68,68,0.2);

    --toggle-bg:        rgba(255,255,255,0.08);
    --toggle-border:    rgba(255,255,255,0.12);
    --toggle-icon:      #9ca3af;
    --toggle-icon-hover: #fff;

    --metric-card-bg:   rgba(255,255,255,0.03);
    --metric-card-border: rgba(255,255,255,0.07);
    --metric-value-color: #ffffff;

    --ring-track:       rgba(255,255,255,0.06);
    --ring-label:       #9ca3af;
    --ring-divider:     rgba(255,255,255,0.1);

    --hero-title:       #ffffff;
    --hero-sub:         #6b7280;
    --hero-glow:        rgba(99,102,241,0.12);
    --mode-toggle-bg:   rgba(255,255,255,0.04);
    --mode-toggle-border: rgba(255,255,255,0.08);
    --mode-inactive:    #6b7280;

    --vuln-row-even:    rgba(255,255,255,0.01);
    --vuln-row-hover:   rgba(255,255,255,0.03);
    --vuln-expand-bg:   rgba(255,255,255,0.01);
    --vuln-code-bg:     rgba(0,0,0,0.4);
    --vuln-code-color:  #fca5a5;

    min-height: 100vh;
    background: var(--bg-base);
    color: var(--text-secondary);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    transition: background 0.3s ease, color 0.3s ease;
  }

  /* ── LIGHT MODE ────────────────────────────────────────────────── */
  .dashboard-root.light {
    --bg-base:          #f8fafc;
    --bg-card:          #ffffff;
    --bg-card-hover:    #f1f5f9;
    --bg-nav:           rgba(248,250,252,0.92);
    --bg-hero:          #f1f5f9;
    --bg-input:         #f8fafc;
    --bg-badge:         rgba(239,68,68,0.08);

    --border-card:      rgba(0,0,0,0.08);
    --border-card-sub:  rgba(0,0,0,0.06);
    --border-input:     rgba(0,0,0,0.1);
    --border-divider:   rgba(0,0,0,0.08);

    --text-primary:     #0f172a;
    --text-secondary:   #1e293b;
    --text-muted:       #64748b;
    --text-faint:       #94a3b8;
    --text-code:        #2563eb;

    --grid-line:        rgba(99,102,241,0.05);

    --badge-error-bg:   rgba(239,68,68,0.08);
    --badge-error-text: #dc2626;
    --badge-error-border: rgba(239,68,68,0.2);

    --toggle-bg:        rgba(0,0,0,0.05);
    --toggle-border:    rgba(0,0,0,0.1);
    --toggle-icon:      #64748b;
    --toggle-icon-hover: #0f172a;

    --metric-card-bg:   #ffffff;
    --metric-card-border: rgba(0,0,0,0.08);
    --metric-value-color: #0f172a;

    --ring-track:       rgba(0,0,0,0.06);
    --ring-label:       #64748b;
    --ring-divider:     rgba(0,0,0,0.08);

    --hero-title:       #0f172a;
    --hero-sub:         #64748b;
    --hero-glow:        rgba(99,102,241,0.06);
    --mode-toggle-bg:   rgba(0,0,0,0.04);
    --mode-toggle-border: rgba(0,0,0,0.1);
    --mode-inactive:    #64748b;

    --vuln-row-even:    #f8fafc;
    --vuln-row-hover:   #f1f5f9;
    --vuln-expand-bg:   #f8fafc;
    --vuln-code-bg:     #fef2f2;
    --vuln-code-color:  #dc2626;

    background: var(--bg-base);
    color: var(--text-secondary);
  }

  /* ── Grid overlay ──────────────────────────────────────────────── */
  .dashboard-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(var(--grid-line) 1px, transparent 1px),
      linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    z-index: 0;
  }

  .content { position: relative; z-index: 1; }

  /* ── Layout ────────────────────────────────────────────────────── */
  .main-grid {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem 4rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .split-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  /* ── Card ──────────────────────────────────────────────────────── */
  .card {
    background: var(--bg-card);
    border: 1px solid var(--border-card);
    border-radius: 20px;
    overflow: hidden;
    transition: background 0.3s ease, border-color 0.3s ease;
  }

  .card-header {
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid var(--border-card-sub);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.75rem;
    transition: border-color 0.3s ease;
  }

  .card-title {
    font-size: 0.9375rem;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.01em;
  }

  .count-badge {
    background: var(--badge-error-bg);
    color: var(--badge-error-text);
    border: 1px solid var(--badge-error-border);
    border-radius: 9999px;
    padding: 2px 10px;
    font-size: 0.7rem;
    font-weight: 700;
  }

  /* ── Theme toggle button ───────────────────────────────────────── */
  .theme-toggle {
    width: 36px;
    height: 36px;
    border-radius: 9999px;
    background: var(--toggle-bg);
    border: 1px solid var(--toggle-border);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s, transform 0.2s;
    color: var(--toggle-icon);
  }
  .theme-toggle:hover {
    background: rgba(99,102,241,0.15);
    border-color: rgba(99,102,241,0.3);
    color: var(--toggle-icon-hover);
    transform: rotate(15deg);
  }
  .theme-toggle .material-symbols-outlined {
    font-size: 18px;
    transition: transform 0.4s ease;
  }

  /* ── Hero ──────────────────────────────────────────────────────── */
  .hero { 
    text-align: center; 
    padding: 5rem 2rem 4rem; 
    position: relative;
    background: var(--bg-hero);
  }
  .hero-glow {
    position: absolute;
    top: 0; left: 50%;
    transform: translateX(-50%);
    width: 600px; height: 300px;
    background: radial-gradient(ellipse at center top, var(--hero-glow) 0%, transparent 70%);
    pointer-events: none;
  }
  .hero h1 {
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 800;
    letter-spacing: -0.04em;
    color: var(--hero-title);
    margin-bottom: 1rem;
    line-height: 1.1;
  }
  .hero p {
    color: var(--hero-sub);
    font-size: 1rem;
    max-width: 480px;
    margin: 0 auto 2.5rem;
    line-height: 1.7;
  }
  .mode-toggle {
    display: inline-flex;
    background: var(--mode-toggle-bg);
    border: 1px solid var(--mode-toggle-border);
    border-radius: 9999px;
    padding: 4px;
    margin-bottom: 1.5rem;
  }
  .mode-btn {
    padding: 6px 18px;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
    font-family: 'Inter', sans-serif;
  }
  .mode-btn.active  { background: #6366f1; color: #fff; }
  .mode-btn.inactive { background: transparent; color: var(--mode-inactive); }
  
  /* ── Repository URL Input ──────────────────────────────────────── */
  .repo-input-container {
    position: relative;
    max-width: 600px;
    margin: 0 auto 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: var(--bg-input);
    border: 1px solid var(--border-input);
    border-radius: 9999px;
    padding: 0.75rem 1.5rem;
    transition: border-color 0.2s, background 0.3s;
  }
  .repo-input-container:focus-within {
    border-color: #6366f1;
    background: var(--bg-card);
  }
  .repo-icon {
    font-size: 20px;
    color: var(--text-muted);
    flex-shrink: 0;
  }
  .repo-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: var(--text-primary);
    font-size: 0.875rem;
    font-family: 'Inter', sans-serif;
    width: 100%;
  }
  .repo-input::placeholder {
    color: var(--text-muted);
  }
  .repo-input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .run-btn {
    position: relative;
    padding: 1rem 3rem;
    border-radius: 9999px;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    cursor: pointer;
    border: none;
    font-family: 'Inter', sans-serif;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: #fff;
    transition: all 0.3s;
  }
  .run-btn:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(99,102,241,0.4);
  }
  .run-btn:disabled { opacity: 0.7; cursor: not-allowed; }
  .run-btn.pulse { animation: btn-pulse 2s infinite; }
  @keyframes btn-pulse {
    0%   { box-shadow: 0 0 0 0 rgba(99,102,241,0.4); }
    70%  { box-shadow: 0 0 0 14px rgba(99,102,241,0); }
    100% { box-shadow: 0 0 0 0 rgba(99,102,241,0); }
  }
  .spinner {
    width: 18px; height: 18px;
    border: 2px solid rgba(255,255,255,0.2);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    display: inline-block;
    vertical-align: middle;
    margin-right: 8px;
  }
  .hero-last-scan {
    margin-top: 1rem;
    font-size: 0.75rem;
    color: var(--text-faint);
  }

  /* ── Metric cards ──────────────────────────────────────────────── */
  .metric-card {
    position: relative;
    background: var(--metric-card-bg);
    border: 1px solid var(--metric-card-border);
    border-radius: 16px;
    padding: 1.25rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    overflow: hidden;
    transition: border-color 0.3s, transform 0.2s, box-shadow 0.3s, background 0.3s;
    cursor: pointer;
  }
  .metric-card:hover {
    transform: translateY(-2px);
    border-color: var(--accent, #6366f1);
    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  }
  .metric-glow {
    position: absolute;
    top: -20px; left: -20px;
    width: 80px; height: 80px;
    background: radial-gradient(circle, var(--accent, #6366f1) 0%, transparent 70%);
    opacity: 0.12;
    pointer-events: none;
  }
  .metric-icon { font-size: 1.5rem; color: var(--accent, #6366f1); flex-shrink: 0; }
  .metric-value {
    font-size: 1.5rem; font-weight: 800;
    color: var(--metric-value-color);
    letter-spacing: -0.03em; line-height: 1; margin-bottom: 2px;
  }
  .metric-label {
    font-size: 0.7rem; font-weight: 600; color: var(--text-muted);
    text-transform: uppercase; letter-spacing: 0.08em;
  }
  .metrics-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }
  .metric-tooltip {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(-8px);
    background: rgba(0,0,0,0.9);
    color: #fff;
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    font-size: 0.75rem;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s;
    z-index: 10;
  }
  .metric-card:hover .metric-tooltip { opacity: 1; }
  .trend-indicator { font-size: 0.875rem; margin-left: 0.25rem; }
  .trend-up { color: #10b981; }
  .trend-down { color: #ef4444; }

  /* ── Score rings ───────────────────────────────────────────────── */
  .ring-track { stroke: var(--ring-track); }
  .ring-label {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ring-label);
  }
  .ring-divider {
    width: 1px; height: 80px;
    background: linear-gradient(to bottom, transparent, var(--ring-divider), transparent);
  }

  /* ── Vuln table ────────────────────────────────────────────────── */
  .vuln-table { width: 100%; border-collapse: collapse; }
  .vuln-table th {
    padding: 0.75rem 1.5rem;
    font-size: 0.6875rem; font-weight: 700;
    color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.1em;
    text-align: left;
    background: var(--bg-card-hover);
    border-bottom: 1px solid var(--border-card-sub);
    cursor: pointer;
    transition: color 0.2s;
  }
  .vuln-table th:hover { color: var(--text-muted); }
  .vuln-table th.sortable::after { content: '⇅'; margin-left: 0.5rem; opacity: 0.3; }
  .vuln-table th.sorted-asc::after { content: '↑'; opacity: 1; color: #6366f1; }
  .vuln-table th.sorted-desc::after { content: '↓'; opacity: 1; color: #6366f1; }
  .vuln-row {
    border-bottom: 1px solid var(--border-card-sub);
    transition: background 0.2s;
    animation: rowIn 0.4s ease both;
  }
  .vuln-row:hover { background: var(--vuln-row-hover); }
  .filter-tab {
    padding: 4px 12px; border-radius: 9999px;
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.05em;
    cursor: pointer; border: 1px solid var(--border-input);
    background: transparent; color: var(--text-muted);
    font-family: 'Inter', sans-serif; transition: all 0.2s;
  }
  .filter-tab.active { background: #6366f1; color: #fff; border-color: #6366f1; }
  .filter-tab:not(.active):hover { color: var(--text-primary); border-color: var(--border-card); }
  .search-box {
    padding: 0.5rem 1rem;
    background: var(--bg-input);
    border: 1px solid var(--border-input);
    border-radius: 9999px;
    color: var(--text-primary);
    font-size: 0.875rem;
    font-family: 'Inter', sans-serif;
    outline: none;
    transition: border-color 0.2s;
  }
  .search-box:focus { border-color: #6366f1; }
  .search-box::placeholder { color: var(--text-muted); }
  .copy-btn {
    padding: 0.25rem 0.5rem;
    background: rgba(99,102,241,0.1);
    border: 1px solid rgba(99,102,241,0.2);
    border-radius: 0.375rem;
    color: #818cf8;
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Inter', sans-serif;
  }
  .copy-btn:hover { background: rgba(99,102,241,0.2); border-color: rgba(99,102,241,0.4); }

  /* ── Material icons ────────────────────────────────────────────── */
  .material-symbols-outlined {
    font-family: 'Material Symbols Outlined';
    font-weight: normal;
    font-style: normal;
    font-size: 20px;
    display: inline-block;
    line-height: 1;
    text-transform: none;
    letter-spacing: normal;
    word-wrap: normal;
    white-space: nowrap;
    direction: ltr;
  }

  .font-mono { font-family: 'JetBrains Mono', monospace; }

  /* ── Responsive ────────────────────────────────────────────────── */
  @media (max-width: 768px) {
    .split-row { grid-template-columns: 1fr; }
    .main-grid { padding: 0 1rem 2rem; }
    .card-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
    .metrics-row { grid-template-columns: repeat(2, 1fr); }
    .metric-card { padding: 1rem; }
    .metric-value { font-size: 1.25rem; }
    .metric-label { font-size: 0.65rem; }
    .hero { padding: 3rem 1.5rem 3rem; }
    .hero h1 { font-size: 2rem; margin-bottom: 0.75rem; }
    .hero p { font-size: 0.875rem; margin-bottom: 2rem; }
    .run-btn { padding: 0.875rem 2rem; font-size: 0.9375rem; }
  }

  @media (max-width: 640px) {
    .main-grid { padding: 0 0.75rem 1.5rem; }
    .card { border-radius: 16px; }
    .card-header { padding: 1rem; }
    .metrics-row { grid-template-columns: 1fr; }
    .hero { padding: 2rem 1rem 2.5rem; }
    .hero h1 { font-size: 1.75rem; }
    .hero p { font-size: 0.8125rem; max-width: 100%; }
    .run-btn { padding: 0.75rem 1.5rem; font-size: 0.875rem; width: 100%; max-width: 320px; }
    .mode-btn { padding: 5px 14px; font-size: 0.6875rem; }
  }
`;

export const SEVERITY_CONFIG = {
  CRITICAL: {
    label: "Critical",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.12)",
    dot: "#ef4444",
  },
  HIGH: {
    label: "High",
    color: "#f97316",
    bg: "rgba(249,115,22,0.12)",
    dot: "#f97316",
  },
  MEDIUM: {
    label: "Medium",
    color: "#eab308",
    bg: "rgba(234,179,8,0.12)",
    dot: "#eab308",
  },
  LOW: {
    label: "Low",
    color: "#6b7280",
    bg: "rgba(107,114,128,0.12)",
    dot: "#6b7280",
  },
};
