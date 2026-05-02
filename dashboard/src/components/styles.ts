export const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #050508;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  .dashboard-root {
    min-height: 100vh;
    background: #050508;
    color: #e2e8f0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  .dashboard-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    z-index: 0;
  }

  .content { position: relative; z-index: 1; }

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

  .card {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    overflow: hidden;
  }

  .card-header {
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .card-title {
    font-size: 0.9375rem;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.01em;
  }

  .count-badge {
    background: rgba(239,68,68,0.12);
    color: #f87171;
    border: 1px solid rgba(239,68,68,0.2);
    border-radius: 9999px;
    padding: 2px 10px;
    font-size: 0.7rem;
    font-weight: 700;
  }

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

  @keyframes rowIn {
    from { opacity: 0; transform: translateX(-8px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

  @media (max-width: 768px) {
    .split-row { grid-template-columns: 1fr; }
    .main-grid { padding: 0 1rem 2rem; }
    .card-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
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
