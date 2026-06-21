import { skillMatchers } from "./skillDatabase";
import { generateRecommendations } from "./recommendationEngine";

export interface ATSAnalysisResult {
  atsScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendations: string[];
  totalKeywords: number;
  resumeWordCount: number;
  jobWordCount: number;
  summary: string;
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
}

function normalizeDocument(text: string): string {
  return text.toLowerCase().normalize("NFKC").replace(/[^a-z0-9+#./-]+/g, " ").replace(/\s+/g, " ").trim();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function containsVariant(document: string, variant: string): boolean {
  const escaped = escapeRegExp(variant).replace(/\s+/g, "\\s+");
  return new RegExp(`(?:^|[^a-z0-9])${escaped}(?=$|[^a-z0-9])`, "i").test(document);
}

export function extractSkills(text: string): string[] {
  const document = normalizeDocument(text);
  if (!document) return [];
  return skillMatchers
    .filter(({ variants }) => variants.some((variant) => containsVariant(document, variant)))
    .map(({ canonical }) => canonical)
    .sort((a, b) => a.localeCompare(b));
}

export const extractJobKeywords = extractSkills;
export const extractResumeKeywords = extractSkills;

export function calculateATSScore(matchedKeywords: number, totalKeywords: number): number {
  if (!Number.isFinite(matchedKeywords) || !Number.isFinite(totalKeywords) || totalKeywords <= 0) return 0;
  const safeMatches = Math.max(0, Math.min(matchedKeywords, totalKeywords));
  return Math.min(100, Math.round((safeMatches / totalKeywords) * 100));
}

export function analyzeResume(resumeText: string, jobDescription: string): ATSAnalysisResult {
  const jobKeywords = extractJobKeywords(jobDescription);
  const resumeKeywords = new Set(extractResumeKeywords(resumeText));
  const matchedSkills = jobKeywords.filter((skill) => resumeKeywords.has(skill));
  const missingSkills = jobKeywords.filter((skill) => !resumeKeywords.has(skill));
  const atsScore = calculateATSScore(matchedSkills.length, jobKeywords.length);
  const recommendations = generateRecommendations({ score: atsScore, matchedSkills, missingSkills, resumeText, jobDescription });
  const summary = jobKeywords.length === 0
    ? "No recognized technical skills were found in the job description. Add a more detailed description for a useful score."
    : atsScore >= 80
      ? "Excellent technical alignment. Your resume covers most of the skills identified in this job description."
      : atsScore >= 60
        ? "Solid alignment. A few accurate, targeted skill additions can strengthen your match."
        : atsScore >= 40
          ? "Partial alignment. Prioritize the missing skills you genuinely have and support them with evidence."
          : "Low technical alignment. Tailor the resume around relevant experience before applying.";

  return {
    atsScore, matchedSkills, missingSkills, recommendations, totalKeywords: jobKeywords.length,
    resumeWordCount: resumeText.trim().split(/\s+/).filter(Boolean).length,
    jobWordCount: jobDescription.trim().split(/\s+/).filter(Boolean).length,
    summary, score: atsScore, matchedKeywords: matchedSkills, missingKeywords: missingSkills,
  };
}
