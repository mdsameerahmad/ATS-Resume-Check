export const skillDatabase = {
  Frontend: [
    "html", "css", "sass", "less", "tailwind css", "bootstrap", "javascript", "typescript",
    "react", "react.js", "next.js", "vue", "vue.js", "angular", "svelte", "redux", "zustand",
    "react query", "storybook", "webpack", "vite", "accessibility", "responsive design", "web components",
    "material ui", "chakra ui", "css modules", "web performance", "seo", "pwa"
  ],
  Backend: [
    "node.js", "nodejs", "express", "express.js", "nestjs", "spring boot", "django", "flask", "fastapi",
    "ruby on rails", "asp.net", ".net", "graphql", "rest api", "restful api", "microservices",
    "websockets", "oauth", "oauth2", "jwt", "api design", "serverless", "grpc", "kafka", "rabbitmq"
  ],
  Database: [
    "sql", "mysql", "postgresql", "postgres", "mongodb", "mongo", "redis", "sqlite", "oracle", "dynamodb",
    "firebase", "supabase", "elasticsearch", "cassandra", "mariadb", "prisma", "sequelize", "typeorm",
    "database design", "data modeling"
  ],
  Cloud: [
    "aws", "amazon web services", "azure", "microsoft azure", "google cloud", "google cloud platform", "gcp",
    "cloudflare", "vercel", "netlify", "lambda", "aws lambda", "ec2", "s3", "cloudfront",
    "cloud functions", "firebase hosting"
  ],
  DevOps: [
    "docker", "kubernetes", "jenkins", "github actions", "gitlab ci", "ci/cd", "cicd", "terraform", "ansible",
    "nginx", "linux", "helm", "prometheus", "grafana", "datadog", "devops", "continuous integration",
    "continuous delivery", "continuous deployment", "observability", "monitoring"
  ],
  AI_ML: [
    "machine learning", "deep learning", "artificial intelligence", "tensorflow", "pytorch", "scikit-learn",
    "sklearn", "pandas", "numpy", "opencv", "nlp", "natural language processing", "llm", "large language models",
    "langchain", "hugging face", "huggingface", "computer vision", "generative ai", "genai", "rag",
    "retrieval augmented generation"
  ],
  "Programming Languages": [
    "javascript", "typescript", "python", "java", "c#", "c sharp", "c++", "cpp", "c", "go", "golang",
    "rust", "ruby", "php", "swift", "kotlin", "scala", "dart", "r", "matlab", "shell", "bash", "powershell"
  ],
  Tools: [
    "git", "github", "gitlab", "bitbucket", "jira", "confluence", "figma", "postman", "swagger", "openapi",
    "visual studio code", "vs code", "vscode", "intellij", "npm", "pnpm", "yarn", "jest", "vitest", "cypress",
    "playwright", "selenium", "testing library", "react testing library", "unit testing", "integration testing",
    "end-to-end testing", "e2e testing", "agile", "scrum"
  ]
} as const;

export type SkillCategory = keyof typeof skillDatabase;

const aliases: Record<string, string> = {
  "react.js": "react", "vue.js": "vue", "nodejs": "node.js", "express.js": "express",
  "amazon web services": "aws", "aws lambda": "lambda", "microsoft azure": "azure",
  "google cloud": "gcp", "google cloud platform": "gcp", "golang": "go", "postgres": "postgresql",
  "mongo": "mongodb", "visual studio code": "vs code", "vscode": "vs code", "restful api": "rest api",
  "continuous integration": "ci/cd", "continuous delivery": "ci/cd", "continuous deployment": "ci/cd", "cicd": "ci/cd",
  "large language models": "llm", "natural language processing": "nlp", "artificial intelligence": "ai",
  "huggingface": "hugging face", "sklearn": "scikit-learn", "genai": "generative ai",
  "retrieval augmented generation": "rag", "c sharp": "c#", "cpp": "c++", "oauth2": "oauth",
  "react testing library": "testing library", "e2e testing": "end-to-end testing"
};

export function normalizeSkillName(skill: string): string {
  const normalized = skill.toLowerCase().trim().replace(/\s+/g, " ");
  return aliases[normalized] ?? normalized;
}

const variantsByCanonical = new Map<string, Set<string>>();
for (const skill of Object.values(skillDatabase).flat()) {
  const canonical = normalizeSkillName(skill);
  const variants = variantsByCanonical.get(canonical) ?? new Set<string>();
  variants.add(skill.toLowerCase());
  variants.add(canonical);
  variantsByCanonical.set(canonical, variants);
}

export const skillMatchers = [...variantsByCanonical.entries()]
  .map(([canonical, variants]) => ({ canonical, variants: [...variants].sort((a, b) => b.length - a.length) }))
  .sort((a, b) => Math.max(...b.variants.map((item) => item.length)) - Math.max(...a.variants.map((item) => item.length)) || a.canonical.localeCompare(b.canonical));

export const allSkills = skillMatchers.map(({ canonical }) => canonical);

export function getSkillCategory(skill: string): SkillCategory | undefined {
  const normalized = normalizeSkillName(skill);
  return (Object.keys(skillDatabase) as SkillCategory[]).find((category) =>
    skillDatabase[category].some((candidate) => normalizeSkillName(candidate) === normalized),
  );
}
