"use client";

import { useEffect, useState } from "react";
import React from "react";
import { type AuditData, type MetricsData } from "../../lib/api";

function useCountUp(end: number, duration: number = 1000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(end * easeOutQuart));
      if (progress < 1) animationFrame = requestAnimationFrame(animate);
      else setCount(end);
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
  );
}

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
