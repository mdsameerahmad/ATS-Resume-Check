import type { ResumeFileType } from "../services/resumeParser";

export const MAX_RESUME_FILE_SIZE = 5 * 1024 * 1024;
export const ALLOWED_RESUME_EXTENSIONS = ["pdf", "txt"] as const;

export interface ValidatedResumeFile {
  file: File;
  fileType: ResumeFileType;
}

class FileValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FileValidationError";
  }
}

export function validateResumeFile(file: File | null | undefined): ValidatedResumeFile {
  if (!file) throw new FileValidationError("Choose a resume file to continue.");
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!extension || !ALLOWED_RESUME_EXTENSIONS.includes(extension as "pdf" | "txt")) throw new FileValidationError("Please upload a PDF or TXT resume.");
  if (file.size > MAX_RESUME_FILE_SIZE) throw new FileValidationError("Your resume must be 5 MB or smaller.");
  if (file.size === 0) throw new FileValidationError("This file is empty. Choose another resume.");
  return { file, fileType: extension as ResumeFileType };
}

export function getResumeErrorMessage(error: unknown): string {
  return error instanceof Error && error.message
    ? error.message
    : "Something went wrong while reading your resume. Please try another file.";
}
