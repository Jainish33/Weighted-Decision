import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { Calibration, Idea } from "@/types";
import { QUADRANT_META } from "@/types";
import { formatCurrency } from "@/lib/scoring";

interface ExportArgs {
  calibration: Calibration;
  ideas: Idea[];
  matrixElement: HTMLElement | null;
}

export async function exportReportPDF({
  calibration,
  ideas,
  matrixElement,
}: ExportArgs): Promise<void> {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  let y = margin;

  const line = (text: string, size = 11, bold = false) => {
    doc.setFontSize(size);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    const wrapped = doc.splitTextToSize(text, pageWidth - margin * 2);
    doc.text(wrapped, margin, y);
    y += wrapped.length * (size + 4);
  };

  const ensureSpace = (needed: number) => {
    if (y + needed > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      y = margin;
    }
  };

  line("Idea Quadrant Analysis Report", 20, true);
  y += 4;
  line(new Date().toLocaleDateString(), 10);
  y += 10;

  line("Your Calibration Anchors", 14, true);
  line(
    `Capital Ceiling: ${formatCurrency(
      calibration.capitalCeiling,
      calibration.currency
    )}`
  );
  line(`Time Ceiling: ${calibration.timeCeiling} months`);
  line(
    `Impact Ceiling: ${formatCurrency(
      calibration.impactCeiling,
      calibration.currency
    )}`
  );
  y += 10;

  // Matrix screenshot
  if (matrixElement) {
    try {
      const canvas = await html2canvas(matrixElement, {
        backgroundColor: "#0F172A",
        scale: 2,
      });
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height / canvas.width) * imgWidth;
      ensureSpace(imgHeight + 30);
      line("The Matrix", 14, true);
      doc.addImage(imgData, "PNG", margin, y, imgWidth, imgHeight);
      y += imgHeight + 20;
    } catch {
      // If screenshot fails, continue without it.
    }
  }

  ensureSpace(60);
  line("Idea Breakdown", 14, true);

  const scored = ideas.filter((i) => i.quadrant !== null);

  // Table header
  const cols = [
    { label: "Idea", x: margin, w: 150 },
    { label: "Effort", x: margin + 160, w: 50 },
    { label: "Impact", x: margin + 215, w: 50 },
    { label: "Quadrant", x: margin + 270, w: 110 },
  ];
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  cols.forEach((c) => doc.text(c.label, c.x, y));
  y += 16;
  doc.setFont("helvetica", "normal");

  scored.forEach((idea) => {
    ensureSpace(40);
    const q = idea.quadrant!;
    const name = doc.splitTextToSize(idea.name, cols[0].w);
    doc.text(name, cols[0].x, y);
    doc.text(String(idea.effortScore), cols[1].x, y);
    doc.text(String(idea.impactScore), cols[2].x, y);
    const qLabel = doc.splitTextToSize(QUADRANT_META[q].label, cols[3].w);
    doc.text(qLabel, cols[3].x, y);
    const rows = Math.max(name.length, qLabel.length);
    y += rows * 14;
    const rec = doc.splitTextToSize(
      `   ${QUADRANT_META[q].recommendation}`,
      pageWidth - margin * 2
    );
    doc.setFontSize(9);
    doc.setTextColor(90);
    doc.text(rec, cols[0].x, y);
    doc.setTextColor(0);
    doc.setFontSize(10);
    y += rec.length * 12 + 8;
  });

  y += 14;
  ensureSpace(80);
  line("Recommendations by Quadrant", 14, true);
  (Object.keys(QUADRANT_META) as Array<keyof typeof QUADRANT_META>).forEach(
    (q) => {
      ensureSpace(40);
      line(QUADRANT_META[q].label, 11, true);
      line(QUADRANT_META[q].recommendation, 10);
      y += 4;
    }
  );

  // Weights used
  if (calibration.weights) {
    y += 14;
    ensureSpace(120);
    line("Weights Used in This Analysis", 14, true);
    y += 4;
    line("Effort Factors", 11, true);
    const ew = calibration.weights.effort;
    line(`  Time to validate: ${ew.time}%  |  Capital required: ${ew.capital}%  |  Skill / team gap: ${ew.skill}%  |  Dependencies: ${ew.dependency}%`, 10);
    y += 6;
    line("Impact Factors", 11, true);
    const iw = calibration.weights.impact;
    line(`  Revenue potential: ${iw.revenue}%  |  Market size / demand: ${iw.market}%  |  Strategic value: ${iw.strategic}%  |  Founder fit: ${iw.fit}%`, 10);
  }

  // Glossary
  y += 20;
  ensureSpace(40);
  line("How to Read This Report", 14, true);
  y += 4;

  const glossary: { term: string; definition: string }[] = [
    {
      term: "The Matrix",
      definition:
        "Each dot is one of your ideas plotted on Effort (horizontal) and Impact (vertical). The dividing lines sit at the midpoint of your personal scale — so 'high' and 'low' are relative to your own ceilings, not a universal standard.",
    },
    {
      term: "Effort Score (0–100)",
      definition:
        "A weighted composite of: time to validate, capital required, skill/team gap, and external dependencies. Higher = more effort needed.",
    },
    {
      term: "Impact Score (0–100)",
      definition:
        "A weighted composite of: revenue potential, market demand clarity, strategic value, and founder fit. Higher = greater potential return. Scores are relative to your personal impact ceiling.",
    },
    {
      term: "Calibration Anchors",
      definition:
        "The ceilings you set at the start. They define what 'high' means for you. Two people scoring the same idea can get different results — that's intentional. This framework measures ideas against your reality.",
    },
    {
      term: "Weights",
      definition:
        "The percentage contribution of each sub-factor to its composite score. A factor with a higher weight has more influence on where your idea lands on the matrix.",
    },
    {
      term: "Gold Mine (low effort, high impact)",
      definition: "Your best opportunities. Act on these first.",
    },
    {
      term: "Moon Shot (high effort, high impact)",
      definition: "Worth pursuing with the right resources and timing. Plan carefully before committing.",
    },
    {
      term: "Quick Win (low effort, low impact)",
      definition: "Easy to do but limited upside. Pursue when you have spare bandwidth.",
    },
    {
      term: "Questionable (high effort, low impact)",
      definition: "Drain resources without proportionate return. Reconsider before committing.",
    },
    {
      term: "Important Caveat",
      definition:
        "This analysis reflects your current knowledge and intuition. Scores on market demand and founder fit are especially subjective. Use this as a starting point for deeper thinking, not a final verdict.",
    },
  ];

  glossary.forEach(({ term, definition }) => {
    ensureSpace(40);
    line(term, 10, true);
    line(definition, 10);
    y += 4;
  });

  doc.save("idea-quadrant-report.pdf");
}
