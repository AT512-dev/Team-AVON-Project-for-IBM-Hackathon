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

    --text-primary:     #ffffff;
    --text-secondary:   #e2e8f0;
    --text-muted:       #6b7280;
    --text-faint:       #4b5563;

    --grid-line:        rgba(99,102,241,0.03);

    --badge-error-bg:   rgba(239,68,68,0.12);
    --badge-error-text: #f87171;
    --badge-error-border: rgba(239,68,68,0.2);

    --toggle-bg:        rgba(255,255,255,0.08);
    --toggle-border:    rgba(255,255,255,0.12);
    --toggle-icon:      #9ca3af;
    --toggle-icon-hover: #fff;

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

    --text-primary:     #0f172a;
    --text-secondary:   #1e293b;
    --text-muted:       #64748b;
    --text-faint:       #94a3b8;

    --grid-line:        rgba(99,102,241,0.05);

    --badge-error-bg:   rgba(239,68,68,0.08);
    --badge-error-text: #dc2626;
    --badge-error-border: rgba(239,68,68,0.2);

    --toggle-bg:        rgba(0,0,0,0.05);
    --toggle-border:    rgba(0,0,0,0.1);
    --toggle-icon:      #64748b;
    --toggle-icon-hover: #0f172a;

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
  }

  @media (max-width: 640px) {
    .main-grid { padding: 0 0.75rem 1.5rem; }
    .card { border-radius: 16px; }
    .card-header { padding: 1rem; }
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
