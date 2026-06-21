import { getSkillCategory, type SkillCategory } from "./skillDatabase";

export interface RecommendationContext {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  resumeText: string;
  jobDescription: string;
}

export function generateRecommendations(context: RecommendationContext): string[] {
  const recommendations: string[] = [];
  const groupedMissing = new Map<SkillCategory | "Other", string[]>();

  for (const skill of context.missingSkills) {
    const category = getSkillCategory(skill) ?? "Other";
    groupedMissing.set(category, [...(groupedMissing.get(category) ?? []), skill]);
  }

  const highestPriorityGap = [...groupedMissing.entries()].sort((a, b) => b[1].length - a[1].length)[0];
  if (highestPriorityGap) {
    recommendations.push(
      `Add relevant ${highestPriorityGap[0]} skills where truthful: ${highestPriorityGap[1].slice(0, 5).join(", ")}.`,
    );
  }

  if (context.matchedSkills.length > 0) {
    recommendations.push(
      `Place high-value matched skills such as ${context.matchedSkills.slice(0, 4).join(", ")} in your summary and recent experience bullets.`,
    );
  } else {
    recommendations.push("Mirror the job description's exact technical terminology in your summary and skills section where accurate.");
  }

  const measurablePattern = /\b\d+(?:\.\d+)?%|\$\s?\d+|\b\d+\+?\s*(users|customers|projects|applications|requests|hours|days|weeks|months|engineers|members)\b/i;
  if (!measurablePattern.test(context.resumeText)) {
    recommendations.push("Strengthen experience bullets with measurable results such as percentages, scale, time saved, revenue, or delivery speed.");
  }

  const projectPattern = /\b(project|built|developed|implemented|launched|designed|created|architected)\b/i;
  if (!projectPattern.test(context.resumeText)) {
    recommendations.push("Add a project or achievement that demonstrates how you applied the role's most important skills in practice.");
  } else if (context.missingSkills.length > 0) {
    recommendations.push(`Improve project bullets by connecting outcomes to relevant skills such as ${context.missingSkills.slice(0, 3).join(", ")}, only when accurate.`);
  }

  if (context.score >= 80) {
    recommendations.push("Keep tailoring concise: preserve the strong match and remove unrelated details that dilute role relevance.");
  }

  return [...new Set(recommendations)].slice(0, 5);
}
