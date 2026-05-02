import { type AuditData } from "./api";
import jsPDF from "jspdf";

const SEVERITY_COLORS: Record<string, [number, number, number]> = {
  CRITICAL: [239, 68, 68],
  HIGH: [249, 115, 22],
  MEDIUM: [234, 179, 8],
  LOW: [107, 114, 128],
};

export async function downloadReport(auditData: AuditData) {
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210;
  const margin = 14;
  const contentW = W - margin * 2;
  let y = 0;

  const hex = (r: number, g: number, b: number) => pdf.setTextColor(r, g, b);
  const fill = (r: number, g: number, b: number) => pdf.setFillColor(r, g, b);

  const newPage = () => {
    pdf.addPage();
    y = 20;
  };

  const checkPageBreak = (needed: number) => {
    if (y + needed > 272) newPage();
  };

  // ── COVER PAGE ─────────────────────────────────────────────────────────────
  fill(15, 15, 20);
  pdf.rect(0, 0, W, 80, "F");
  fill(99, 102, 241);
  pdf.rect(0, 80, W, 3, "F");

  pdf.setFontSize(28);
  pdf.setFont("helvetica", "bold");
  hex(255, 255, 255);
  pdf.text("CodeGuard", W / 2, 38, { align: "center" });

  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");
  hex(156, 163, 175);
  pdf.text("Security Audit Report", W / 2, 50, { align: "center" });

  pdf.setFontSize(9);
  hex(107, 114, 128);
  pdf.text(`Generated: ${new Date().toLocaleString()}`, W / 2, 62, {
    align: "center",
  });

  const score = auditData.overallScore ?? 92;
  const scoreColor: [number, number, number] =
    score >= 80 ? [16, 185, 129] : score >= 60 ? [234, 179, 8] : [239, 68, 68];
  fill(...scoreColor);
  pdf.roundedRect(W / 2 - 20, 90, 40, 18, 3, 3, "F");
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  hex(255, 255, 255);
  pdf.text(`${score}%`, W / 2, 102, { align: "center" });
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "normal");
  hex(107, 114, 128);
  pdf.text("Overall Security Score", W / 2, 116, { align: "center" });

  // ── SUMMARY SECTION ────────────────────────────────────────────────────────
  y = 132;
  pdf.setFontSize(13);
  pdf.setFont("helvetica", "bold");
  hex(30, 30, 35);
  pdf.text("Executive Summary", margin, y);
  fill(99, 102, 241);
  pdf.rect(margin, y + 2, 40, 1, "F");
  y += 12;

  const cards = [
    {
      label: "Total Issues",
      value: String(auditData.summary.total),
      color: [99, 102, 241] as [number, number, number],
    },
    {
      label: "Critical",
      value: String(auditData.summary.critical),
      color: [239, 68, 68] as [number, number, number],
    },
    {
      label: "High",
      value: String(auditData.summary.high),
      color: [249, 115, 22] as [number, number, number],
    },
    {
      label: "Medium",
      value: String(auditData.summary.medium),
      color: [234, 179, 8] as [number, number, number],
    },
    {
      label: "Low",
      value: String(auditData.summary.low),
      color: [107, 114, 128] as [number, number, number],
    },
  ];

  const cardW = (contentW - 8) / cards.length;
  cards.forEach((card, i) => {
    const cx = margin + i * (cardW + 2);
    fill(248, 248, 252);
    pdf.setDrawColor(220, 220, 235);
    pdf.roundedRect(cx, y, cardW, 22, 2, 2, "FD");
    fill(...card.color);
    pdf.roundedRect(cx, y, cardW, 3, 2, 2, "F");

    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    hex(...card.color);
    pdf.text(card.value, cx + cardW / 2, y + 13, { align: "center" });

    pdf.setFontSize(7);
    pdf.setFont("helvetica", "normal");
    hex(107, 114, 128);
    pdf.text(card.label, cx + cardW / 2, y + 20, { align: "center" });
  });
  y += 30;

  // ── IMPACT SECTION ─────────────────────────────────────────────────────────
  pdf.setFontSize(13);
  pdf.setFont("helvetica", "bold");
  hex(30, 30, 35);
  pdf.text("Impact Analysis", margin, y);
  fill(99, 102, 241);
  pdf.rect(margin, y + 2, 36, 1, "F");
  y += 12;

  const impactItems = [
    {
      label: "Time Saved",
      value: `${auditData.impact.time_saved_hours}h (${auditData.impact.time_saved_minutes} min)`,
    },
    { label: "Manual Review Cost", value: auditData.impact.manual_review_cost },
    { label: "Automated Cost", value: auditData.impact.automated_cost },
    { label: "Total Savings", value: auditData.impact.savings },
  ];

  const halfW = (contentW - 4) / 2;
  impactItems.forEach((item, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const ix = margin + col * (halfW + 4);
    const iy = y + row * 14;

    fill(248, 248, 252);
    pdf.setDrawColor(220, 220, 235);
    pdf.roundedRect(ix, iy, halfW, 11, 2, 2, "FD");

    pdf.setFontSize(7.5);
    pdf.setFont("helvetica", "bold");
    hex(107, 114, 128);
    pdf.text(item.label, ix + 4, iy + 7);

    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
    hex(99, 102, 241);
    pdf.text(item.value, ix + halfW - 4, iy + 7, { align: "right" });
  });
  y += 32;

  // ── VULNERABILITIES SECTION ────────────────────────────────────────────────
  checkPageBreak(20);
  pdf.setFontSize(13);
  pdf.setFont("helvetica", "bold");
  hex(30, 30, 35);
  pdf.text("Vulnerability Details", margin, y);
  fill(99, 102, 241);
  pdf.rect(margin, y + 2, 50, 1, "F");
  y += 10;

  // Each vulnerability as its own card block
  auditData.vulnerabilities.forEach((vuln, idx) => {
    const blockH = 38;
    checkPageBreak(blockH + 4);

    const sc = SEVERITY_COLORS[vuln.severity] ?? [107, 114, 128];
    const isEven = idx % 2 === 0;

    // Card background
    fill(isEven ? 252 : 248, isEven ? 252 : 248, isEven ? 255 : 252);
    pdf.setDrawColor(220, 220, 235);
    pdf.roundedRect(margin, y, contentW, blockH, 2, 2, "FD");

    // Left severity bar
    fill(...sc);
    pdf.roundedRect(margin, y, 3, blockH, 1, 1, "F");

    // ── Row 1: index + file + line + severity badge ──
    const innerX = margin + 6;
    const innerW = contentW - 8;

    // Index number
    pdf.setFontSize(7);
    pdf.setFont("helvetica", "bold");
    hex(180, 180, 200);
    pdf.text(`#${idx + 1}`, innerX, y + 7);

    // File path
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
    hex(59, 130, 246);
    const fileStr =
      vuln.file.length > 35 ? "..." + vuln.file.slice(-33) : vuln.file;
    pdf.text(fileStr, innerX + 8, y + 7);

    // Line number
    pdf.setFontSize(7);
    pdf.setFont("helvetica", "normal");
    hex(150, 150, 170);
    pdf.text(
      `line ${vuln.line}`,
      innerX + 8 + pdf.getTextWidth(fileStr) + 3,
      y + 7,
    );

    // Severity badge — right aligned
    fill(...sc);
    const badgeW = 22;
    pdf.roundedRect(
      margin + contentW - badgeW - 4,
      y + 2.5,
      badgeW,
      6,
      1,
      1,
      "F",
    );
    pdf.setFontSize(6);
    pdf.setFont("helvetica", "bold");
    hex(255, 255, 255);
    pdf.text(vuln.severity, margin + contentW - badgeW / 2 - 4, y + 6.8, {
      align: "center",
    });

    // ── Row 2: Issue type + CVSS ──
    pdf.setFontSize(7.5);
    pdf.setFont("helvetica", "bold");
    hex(50, 50, 70);
    const typeStr = vuln.type.replace(/_/g, " ");
    pdf.text(typeStr, innerX, y + 15);

    // CVSS score
    if (vuln.cvssScore) {
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "normal");
      hex(...sc);
      pdf.text(
        `CVSS: ${vuln.cvssScore.toFixed(1)}`,
        margin + contentW - 25,
        y + 15,
      );
    }

    // CWE
    if (vuln.cwe) {
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "normal");
      hex(150, 150, 170);
      pdf.text(vuln.cwe, innerX + pdf.getTextWidth(typeStr) + 4, y + 15);
    }

    // ── Row 3: Description ──
    pdf.setFontSize(7);
    pdf.setFont("helvetica", "normal");
    hex(80, 80, 100);
    const desc =
      vuln.description.length > 105
        ? vuln.description.slice(0, 103) + "…"
        : vuln.description;
    pdf.text(desc, innerX, y + 23, { maxWidth: innerW - 6 });

    // ── Row 4: Fix suggestion ──
    pdf.setFontSize(6.5);
    pdf.setFont("helvetica", "italic");
    hex(16, 185, 129);
    const fix =
      vuln.fix_suggestion.length > 110
        ? vuln.fix_suggestion.slice(0, 108) + "…"
        : vuln.fix_suggestion;
    pdf.text(`Fix: ${fix}`, innerX, y + 31, { maxWidth: innerW - 6 });

    // ── Confidence bar ──
    const barX = innerX;
    const barY = y + blockH - 5;
    const barW = 40;
    fill(220, 220, 235);
    pdf.roundedRect(barX, barY, barW, 2.5, 1, 1, "F");
    fill(99, 102, 241);
    pdf.roundedRect(barX, barY, barW * vuln.confidence, 2.5, 1, 1, "F");
    pdf.setFontSize(6);
    pdf.setFont("helvetica", "normal");
    hex(120, 120, 150);
    pdf.text(
      `Confidence: ${Math.round(vuln.confidence * 100)}%`,
      barX + barW + 2,
      barY + 2.2,
    );

    y += blockH + 3;
  });

  // ── FOOTER ────────────────────────────────────────────────────────────────
  const totalPages = pdf.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    pdf.setPage(p);
    fill(99, 102, 241);
    pdf.rect(0, 289, W, 8, "F");
    pdf.setFontSize(7);
    pdf.setFont("helvetica", "normal");
    hex(255, 255, 255);
    pdf.text("CodeGuard — Automated Security Audit", margin, 294);
    pdf.text(`Page ${p} of ${totalPages}`, W - margin, 294, { align: "right" });
  }

  pdf.save(`codeguard-report-${Date.now()}.pdf`);
}
