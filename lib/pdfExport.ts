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

  doc.save("idea-quadrant-report.pdf");
}
