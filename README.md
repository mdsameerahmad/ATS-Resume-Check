# ATS Resume Match Analyzer

A privacy-first browser application that analyzes how well a resume matches a job description using deterministic ATS-style keyword matching and actionable insights.

This app is built for resume optimization without any backend, account system, or file upload service. All parsing, matching, scoring, and report generation happen entirely in the user's browser.

## Table of Contents

- [What it does](#what-it-does)
- [How it works](#how-it-works)
- [Workflow diagram](#workflow-diagram)
- [Core features](#core-features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Key implementation details](#key-implementation-details)
- [Local development](#local-development)
- [Quality checks](#quality-checks)
- [Deployment](#deployment)
- [Privacy](#privacy)
- [Assignment details](#assignment-details)

## What it does

`ATS Resume Match Analyzer` helps job seekers evaluate a resume against a target job description by:

- extracting text from uploaded PDF or TXT resumes,
- identifying shared technical skills and keywords,
- calculating an ATS-style match score,
- highlighting matched and missing skills,
- generating tailored resume improvement recommendations,
- exporting a polished analysis report as a PDF.

## How it works

The app follows a client-side workflow:

1. User uploads a resume file (`.pdf` or `.txt`).
2. The resume parser extracts and normalizes text.
3. The user pastes a job description into the form.
4. The ATS engine extracts skill keywords from both the resume and the job description.
5. The analyzer computes a match score and identifies matched vs missing skills.
6. A recommendation engine generates targeted guidance.
7. Users can download the analysis as a PDF report.

## Workflow diagram

```text
+----------------+      +------------------------+      +-------------------------+
| Resume Upload  | ---> | Resume Parsing &       | ---> | Normalized Resume Text  |
| (.pdf / .txt)  |      | Validation             |      |                         |
+----------------+      +------------------------+      +-------------------------+
                                                                    |
                                                                    v
+----------------+      +------------------------+      +-------------------------+
| Job Description| ---> | ATS Analysis Engine    | ---> | Match Score + Insights  |
| Paste Input    |      | (keyword extraction,   |      |                         |
+----------------+      | normalization, scoring)|      +-------------------------+
                                                                    |
                                                                    v
                                                            +-------------------------+
                                                            | Recommendation Engine   |
                                                            | + Report Export         |
                                                            +-------------------------+
```

## Core features

- Browser-only PDF and TXT resume ingestion
- Drag-and-drop resume upload with keyboard support
- File validation for allowed format and 5 MB max size
- PDF.js text extraction for PDF resumes
- Text normalization and noise removal for reliable keyword matching
- Categorized technical skill library for matching common hiring terms
- Matched skills, missing skills, and job-resume keyword comparison
- ATS-style score calculation with clear performance thresholds
- Context-aware improvement recommendations
- Downloadable PDF report with score, matched skills, missing skills, and recommendations
- Dark mode with accessible UI states and toast feedback

## Tech stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React icons
- PDF.js for PDF text extraction
- jsPDF for client-side PDF report generation
- ESLint for linting

## Project structure

```text
src/
  App.tsx                    - Main application orchestration and state flow
  components/                - UI building blocks and page sections
    AnalyzerCard.tsx         - Resume upload + job description inputs
    ResultsPanel.tsx         - Score visualization + matched/missing skills
    ResumeUpload.tsx         - Drag/drop upload and validation UI
    Features.tsx             - Feature highlight section
    Header.tsx               - Top navigation and theme toggle
    Footer.tsx               - Footer content
    ats/                     - ATS-specific visual components
      ATSScoreGauge.tsx      - Circular score gauge visualization
      InsightCard.tsx        - Skill / recommendation cards
    ui/                      - Reusable UI controls and toast notifications
  lib/                       - Analysis, validation, and export engine
    atsEngine.ts             - Skill extraction, scoring, and summary logic
    recommendationEngine.ts  - Targeted resume improvement recommendations
    skillDatabase.ts         - Canonical skills, categories, and aliases
    file-validation.ts       - Resume file checks and user-facing errors
    export-report.ts         - PDF report generation using jsPDF
  services/                  - Browser-only resume parsing logic
    resumeParser.ts          - PDF/TXT extraction and normalization
```

## Key implementation details

### Resume parsing

- `src/services/resumeParser.ts` handles resume ingestion.
- PDF resumes use `pdfjs-dist` to read text content from each page.
- TXT resumes are read directly through the browser file API.
- The parser validates file type, validates PDF signature, and rejects empty or unreadable files.
- Text is normalized by cleaning whitespace, replacing non-printable characters, and converting to a consistent form.
- If a PDF contains image-only content, the parser returns a friendly error asking the user to use OCR first.

### File validation

- `src/lib/file-validation.ts` enforces:
  - accepted extensions: `.pdf`, `.txt`
  - maximum file size: 5 MB
  - non-empty content
- Errors are surfaced in the UI and through toast notifications.

### ATS analysis engine

- `src/lib/atsEngine.ts` performs the core match computation.
- Both resume and job description text are normalized with punctuation stripped, casing unified, and whitespace collapsed.
- A curated skill database maps common terms and aliases to canonical skill tokens.
- Skill matching uses exact and variant-aware regex searches so phrases like `React.js` and `react` are treated consistently.
- The score is computed as a simple ratio of matched job keywords against total job keywords, then converted to a percentage.
- Analysis output includes:
  - `atsScore`
  - `matchedSkills`
  - `missingSkills`
  - `recommendations`
  - `resumeWordCount`
  - `jobWordCount`
  - human-friendly `summary`

### Skill database and categories

- `src/lib/skillDatabase.ts` defines categories such as:
  - Frontend
  - Backend
  - Database
  - Cloud
  - DevOps
  - AI/ML
  - Programming Languages
  - Tools
- A normalization layer maps aliases like `nodejs` → `node.js` and `postgres` → `postgresql`.
- This enables robust matching across resume wording variations.

### Recommendations

- `src/lib/recommendationEngine.ts` generates practical suggestions after analysis.
- It prioritizes:
  - high-value missing skill categories,
  - matched skills to emphasize in summaries and experience bullets,
  - evidence-based resume language such as measurable impact,
  - project statements when they are missing,
  - concise tailoring advice for strong matches.
- Recommendations are kept unique and limited to the top five messages.

### Result visualization and export

- `src/components/ResultsPanel.tsx` displays the score with a radial gauge and summarizes the analysis.
- `ATSScoreGauge.tsx` animates the match percentage and provides a text label.
- Insight cards show matched skills, missing skills, and recommendations.
- The export button uses `jsPDF` to create a downloadable PDF report with:
  - ATS score
  - summary text
  - matched skills
  - missing skills
  - recommendations
  - timestamp and privacy note

## Local development

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open the app in your browser:

```text
http://localhost:5173
```

## Quality checks

Run linting and build validation:

```bash
npm run lint
npm run build
npm run preview
```

## Deployment

This repository is optimized for static deployment.

- Build command: `npm run build`
- Output directory: `dist`

See [DEPLOYMENT.md](./DEPLOYMENT.md) for Vercel dashboard and CLI deployment instructions.

## Privacy

This application is designed to preserve user privacy:

- no backend service is required,
- no file upload occurs,
- resume text is processed locally in the browser,
- analysis and report creation happen on-device only.

## Assignment details

- Name: Md Sameer Ahmad
- Email: mohammadsameerahmad2005@gmail.com
- Built for: Digital Heroes (https://digitalheroesco.com)
