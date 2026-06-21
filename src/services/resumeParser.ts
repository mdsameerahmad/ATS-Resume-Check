import * as pdfjs from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

export type ResumeFileType = "pdf" | "txt";
export interface ParsedResume { rawResumeText: string; normalizedResumeText: string; fileName: string; fileType: ResumeFileType; }
export type ResumeParserErrorCode = "EMPTY_FILE" | "PDF_READ_ERROR" | "TXT_READ_ERROR";

export class ResumeParserError extends Error {
  constructor(message: string, public readonly code: ResumeParserErrorCode) { super(message); this.name = "ResumeParserError"; }
}

export async function extractPdfText(file: File): Promise<string> {
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
  let document: pdfjs.PDFDocumentProxy | undefined;
  try {
    document = await loadingTask.promise;
    const pages: string[] = [];
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      try {
        const content = await page.getTextContent();
        const parts: string[] = [];
        let previousY: number | undefined;
        for (const item of content.items) {
          if (!("str" in item) || !item.str) continue;
          const currentY = item.transform[5];
          const startsNewLine = item.hasEOL || (previousY !== undefined && Math.abs(currentY - previousY) > 2);
          parts.push(`${startsNewLine && parts.length ? "\n" : parts.length ? " " : ""}${item.str}`);
          previousY = currentY;
        }
        pages.push(parts.join("").trim());
      } finally {
        page.cleanup();
      }
    }
    return pages.join("\n\n").trim();
  } catch {
    throw new ResumeParserError("We could not read this PDF. It may be password-protected, corrupted, or image-only.", "PDF_READ_ERROR");
  } finally {
    if (document) await document.destroy();
    else await loadingTask.destroy().catch(() => undefined);
  }
}

export async function extractTxtText(file: File): Promise<string> {
  try { return (await file.text()).replace(/^\uFEFF/, ""); }
  catch { throw new ResumeParserError("We could not read this text file.", "TXT_READ_ERROR"); }
}

export function cleanResumeText(text: string): string {
  return text.replace(/\r\n?/g, "\n").replace(/[\u00A0\u2007\u202F]/g, " ").replace(/[^\S\n]+/g, " ").replace(/ *\n */g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

export function normalizeText(text: string): string {
  return cleanResumeText(text).normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{N}+#./\-\n ]/gu, " ").replace(/[^\S\n]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

export async function parseResume(file: File): Promise<ParsedResume> {
  const fileType: ResumeFileType = file.name.toLowerCase().endsWith(".pdf") ? "pdf" : "txt";
  if (fileType === "pdf") {
    const signature = new TextDecoder("ascii").decode((await file.slice(0, 5).arrayBuffer()));
    if (signature !== "%PDF-") throw new ResumeParserError("This file does not appear to be a valid PDF.", "PDF_READ_ERROR");
  }
  const rawResumeText = cleanResumeText(fileType === "pdf" ? await extractPdfText(file) : await extractTxtText(file));
  if (!rawResumeText) throw new ResumeParserError("No readable text was found. If this is a scanned PDF, export it with OCR first.", "EMPTY_FILE");
  return { rawResumeText, normalizedResumeText: normalizeText(rawResumeText), fileName: file.name, fileType };
}
