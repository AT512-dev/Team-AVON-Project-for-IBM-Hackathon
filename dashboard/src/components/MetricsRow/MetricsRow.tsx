"use client";

import { useEffect, useState } from "react";
import { type AuditData, type MetricsData } from "../../lib/api";

// Animated counter hook
function useCountUp(end: number, duration: number = 1000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(end * easeOutQuart));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return count;
}

interface MetricsRowProps {
  auditData: AuditData;
  metrics: MetricsData | null;
  beforeScore: number;
}

function MetricCard({
  label,
  value,
  icon,
  accent,
  tooltip,
  trend,
}: {
  label: string;
  value: string;
  icon: string;
  accent: string;
  tooltip?: string;
  trend?: "up" | "down";
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <>
      <style>{`
        .metric-card {
          position: relative;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 1.25rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          overflow: hidden;
          transition: border-color 0.3s, transform 0.2s, box-shadow 0.3s;
          cursor: pointer;
        }
        .metric-card:hover {
          transform: translateY(-2px);
          border-color: var(--accent, #6366f1);
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
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
          font-size: 1.5rem; font-weight: 800; color: #fff;
          letter-spacing: -0.03em; line-height: 1; margin-bottom: 2px;
        }
        .metric-label {
          font-size: 0.7rem; font-weight: 600; color: #6b7280;
          text-transform: uppercase; letter-spacing: 0.08em;
        }
        .metrics-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        @media (max-width: 768px) {
          .metrics-row {
            grid-template-columns: repeat(2, 1fr);
          }
          .metric-card {
            padding: 1rem;
          }
          .metric-value { font-size: 1.25rem; }
          .metric-label { font-size: 0.65rem; }
        }

        @media (max-width: 640px) {
          .metrics-row {
            grid-template-columns: 1fr;
          }
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
        .metric-card:hover .metric-tooltip {
          opacity: 1;
        }
        .trend-indicator {
          font-size: 0.875rem;
          margin-left: 0.25rem;
        }
        .trend-up { color: #10b981; }
        .trend-down { color: #ef4444; }
      `}</style>
      <div
        className="metric-card"
        style={{ "--accent": accent } as React.CSSProperties}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="metric-glow" />
        {tooltip && showTooltip && (
          <div className="metric-tooltip">{tooltip}</div>
        )}
        <span className="metric-icon material-symbols-outlined">{icon}</span>
        <div style={{ flex: 1 }}>
          <p className="metric-value">
            {value}
            {trend && (
              <span className={`trend-indicator trend-${trend}`}>
                {trend === "up" ? "↑" : "↓"}
              </span>
            )}
          </p>
          <p className="metric-label">{label}</p>
        </div>
      </div>
    </>
  );
}

import React from "react";

export default function MetricsRow({
  auditData,
  metrics,
  beforeScore,
}: MetricsRowProps) {
  const afterScore = auditData.overallScore ?? 92;
  const animatedBefore = useCountUp(Math.max(10, beforeScore), 1200);
  const animatedAfter = useCountUp(afterScore, 1200);
  const animatedHours = useCountUp(
    Math.floor(auditData.impact.time_saved_hours * 10) / 10,
    1000,
  );

  return (
    <div className="metrics-row">
      <MetricCard
        label="Score Before"
        value={`${animatedBefore}%`}
        icon="trending_down"
        accent="#ef4444"
        tooltip="Security score before fixes"
        trend="down"
      />
      <MetricCard
        label="Score After"
        value={`${animatedAfter}%`}
        icon="trending_up"
        accent="#10b981"
        tooltip="Projected score after applying fixes"
        trend="up"
      />
      <MetricCard
        label="Time Saved"
        value={`${(animatedHours / 10).toFixed(1)}h`}
        icon="schedule"
        accent="#6366f1"
        tooltip="Time saved vs manual code review"
      />
      <MetricCard
        label="Cost Saved"
        value={auditData.impact.savings}
        icon="payments"
        accent="#8b5cf6"
        tooltip="Estimated cost savings from automation"
      />
      {metrics && (
        <MetricCard
          label="Efficiency"
          value={metrics.efficiency_improvement}
          icon="bolt"
          accent="#f59e0b"
          tooltip="Efficiency improvement over manual review"
        />
      )}
    </div>
  );
}
