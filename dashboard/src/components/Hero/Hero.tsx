"use client";

export type ScanMode = "demo" | "live";

interface HeroProps {
  loading: boolean;
  hasData: boolean;
  scanMode: ScanMode;
  lastAudit: string | null;
  onRunAudit: () => void;
  onScanModeChange: (mode: ScanMode) => void;
}

export default function Hero({
  loading,
  hasData,
  scanMode,
  lastAudit,
  onRunAudit,
  onScanModeChange,
}: HeroProps) {
  return (
    <>
      <style>{`
        .hero {
          text-align: center;
          padding: 5rem 2rem 4rem;
          position: relative;
        }
        .hero-glow {
          position: absolute;
          top: 0; left: 50%;
          transform: translateX(-50%);
          width: 600px; height: 300px;
          background: radial-gradient(ellipse at center top, rgba(99,102,241,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero h1 {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          color: #fff;
          margin-bottom: 1rem;
          line-height: 1.1;
        }
        .hero p {
          color: #6b7280;
          font-size: 1rem;
          max-width: 480px;
          margin: 0 auto 2.5rem;
          line-height: 1.7;
        }
        .mode-toggle {
          display: inline-flex;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
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
        .mode-btn.inactive { background: transparent; color: #6b7280; }
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

        @media (max-width: 768px) {
          .hero { padding: 3rem 1.5rem 3rem; }
          .hero h1 { font-size: 2rem; margin-bottom: 0.75rem; }
          .hero p { font-size: 0.875rem; margin-bottom: 2rem; }
          .run-btn { padding: 0.875rem 2rem; font-size: 0.9375rem; }
          .mode-toggle { margin-bottom: 1.25rem; }
        }

        @media (max-width: 640px) {
          .hero { padding: 2rem 1rem 2.5rem; }
          .hero h1 { font-size: 1.75rem; }
          .hero p { font-size: 0.8125rem; max-width: 100%; }
          .run-btn {
            padding: 0.75rem 1.5rem;
            font-size: 0.875rem;
            width: 100%;
            max-width: 320px;
          }
          .mode-btn { padding: 5px 14px; font-size: 0.6875rem; }
        }
      `}</style>

      <section className="hero">
        <div className="hero-glow" />
        <h1>
          One-Click Security
          <br />
          Audit
        </h1>
        <p>
          Detect vulnerabilities across your codebase in seconds. Powered by AI
          — zero config needed.
        </p>

        <div className="mode-toggle">
          <button
            className={`mode-btn ${scanMode === "demo" ? "active" : "inactive"}`}
            onClick={() => onScanModeChange("demo")}
          >
            DEMO
          </button>
          <button
            className={`mode-btn ${scanMode === "live" ? "active" : "inactive"}`}
            onClick={() => onScanModeChange("live")}
          >
            LIVE API
          </button>
        </div>

        <br />

        <button
          className={`run-btn ${!loading && !hasData ? "pulse" : ""}`}
          onClick={onRunAudit}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner" />
              Scanning Codebase…
            </>
          ) : hasData ? (
            <>
              <span
                className="material-symbols-outlined"
                style={{
                  verticalAlign: "middle",
                  marginRight: 8,
                  fontSize: 18,
                }}
              >
                refresh
              </span>
              Re-run Audit
            </>
          ) : (
            <>
              <span
                className="material-symbols-outlined"
                style={{
                  verticalAlign: "middle",
                  marginRight: 8,
                  fontSize: 18,
                }}
              >
                play_arrow
              </span>
              Run Audit Now
            </>
          )}
        </button>

        {lastAudit && (
          <p
            style={{ marginTop: "1rem", fontSize: "0.75rem", color: "#4b5563" }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 14, verticalAlign: "middle", marginRight: 4 }}
            >
              history
            </span>
            Last scan at {lastAudit}
          </p>
        )}
      </section>
    </>
  );
}
