import type { AnalysisResult } from "./analyzer";

export async function exportAnalysis(result: AnalysisResult, fileName: string): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  const generatedAt = new Date();
  let y = 0;

  const addHeader = () => {
    doc.setFillColor(23, 35, 31);
    doc.rect(0, 0, pageWidth, 42, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("ATS Resume Match Report", margin, 22);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Resume: ${fileName}`, margin, 31);
    y = 55;
  };

  const ensureSpace = (needed: number) => {
    if (y + needed <= pageHeight - 20) return;
    doc.addPage();
    addHeader();
  };

  const addSection = (title: string, items: string[], emptyText: string) => {
    const rows = items.length ? items : [emptyText];
    const lines = rows.flatMap((item) => doc.splitTextToSize(`• ${item}`, contentWidth - 4) as string[]);
    ensureSpace(14 + lines.length * 5);
    doc.setTextColor(23, 35, 31);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(title, margin, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(65, 77, 71);
    for (const line of lines) {
      ensureSpace(6);
      doc.text(line, margin + 2, y);
      y += 5;
    }
    y += 6;
  };

  addHeader();
  doc.setTextColor(23, 35, 31);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(36);
  doc.text(`${result.atsScore}%`, margin, y);
  doc.setFontSize(12);
  doc.text("ATS Match Score", margin + 42, y - 2);
  y += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(65, 77, 71);
  const summaryLines = doc.splitTextToSize(result.summary, contentWidth) as string[];
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 5 + 10;

  addSection("Matched Skills", result.matchedSkills, "No recognized matched skills.");
  addSection("Missing Skills", result.missingSkills, "No recognized skill gaps.");
  addSection("Recommendations", result.recommendations, "No recommendations generated.");

  ensureSpace(22);
  doc.setDrawColor(210, 216, 212);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;
  doc.setFontSize(9);
  doc.setTextColor(100, 110, 105);
  doc.text(`Generated: ${generatedAt.toLocaleString()}`, margin, y);
  doc.text("Processed privately in your browser", margin, y + 5);

  const safeName = fileName.replace(/\.[^.]+$/, "").replace(/[^a-z0-9-_]+/gi, "-").replace(/^-|-$/g, "") || "resume";
  doc.save(`${safeName}-ats-report.pdf`);
}
