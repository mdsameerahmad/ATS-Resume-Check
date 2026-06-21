import { Suspense, lazy, useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, LoaderCircle, LockKeyhole } from "lucide-react";
import { Header } from "./components/Header";
import { AnalyzerCard } from "./components/AnalyzerCard";
import { Footer } from "./components/Footer";
import { Badge } from "./components/ui/Badge";
import { Toast, type ToastMessage } from "./components/ui/Toast";
import { analyzeMatch, type AnalysisResult } from "./lib/analyzer";
import { getResumeErrorMessage, validateResumeFile } from "./lib/file-validation";
import type { ResumeFileType } from "./services/resumeParser";

const ResultsPanel = lazy(() => import("./components/ResultsPanel").then((module) => ({ default: module.ResultsPanel })));
const Features = lazy(() => import("./components/Features").then((module) => ({ default: module.Features })));

function SectionLoader() {
  return <div className="mx-auto grid min-h-48 max-w-6xl place-items-center px-5" role="status"><LoaderCircle className="animate-spin text-moss dark:text-lime" /><span className="sr-only">Loading section</span></div>;
}

function App() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") ? localStorage.getItem("theme") === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches);
  const [file, setFile] = useState<File | null>(null);
  const [rawResumeText, setRawResumeText] = useState("");
  const [normalizedResumeText, setNormalizedResumeText] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [resumeFileType, setResumeFileType] = useState<ResumeFileType | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fileError, setFileError] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => { document.documentElement.classList.toggle("dark", isDark); localStorage.setItem("theme", isDark ? "dark" : "light"); }, [isDark]);
  useEffect(() => { if (!toast) return; const timeout = window.setTimeout(() => setToast(null), 4200); return () => window.clearTimeout(timeout); }, [toast]);

  const notify = useCallback((message: string, variant: ToastMessage["variant"]) => setToast({ id: Date.now(), message, variant }), []);
  const clearResume = useCallback(() => { setFile(null); setRawResumeText(""); setNormalizedResumeText(""); setResumeFileName(""); setResumeFileType(null); setFileError(""); setResult(null); }, []);

  const handleFile = useCallback(async (selectedFile: File) => {
    setFileError("");
    try {
      validateResumeFile(selectedFile); setFile(selectedFile); setIsParsing(true); setResult(null);
      const { parseResume } = await import("./services/resumeParser");
      const parsed = await parseResume(selectedFile);
      setRawResumeText(parsed.rawResumeText); setNormalizedResumeText(parsed.normalizedResumeText); setResumeFileName(parsed.fileName); setResumeFileType(parsed.fileType);
      notify(`${parsed.fileName} is ready to analyze.`, "success");
    } catch (error) {
      const message = getResumeErrorMessage(error); setFileError(message); notify(message, "error"); clearResume(); setFileError(message);
    } finally { setIsParsing(false); }
  }, [clearResume, notify]);

  const handleAnalyze = useCallback(() => {
    if (!normalizedResumeText || !jobDescription.trim()) { notify("Add a readable resume and job description first.", "error"); return; }
    setIsAnalyzing(true);
    window.setTimeout(() => {
      try { setResult(analyzeMatch(normalizedResumeText, jobDescription)); }
      catch { notify("We could not complete the analysis. Please review the inputs and try again.", "error"); }
      finally { setIsAnalyzing(false); window.setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50); }
    }, 120);
  }, [jobDescription, normalizedResumeText, notify]);

  const reset = useCallback(() => { clearResume(); setJobDescription(""); document.getElementById("analyzer")?.scrollIntoView({ behavior: "smooth" }); }, [clearResume]);
  const handleExport = useCallback(async () => {
    if (!result) return;
    try { const { exportAnalysis } = await import("./lib/export-report"); await exportAnalysis(result, resumeFileName || file?.name || "resume"); notify("Your ATS report has been downloaded.", "success"); }
    catch { notify("The report could not be generated. Please try again.", "error"); }
  }, [file?.name, notify, result, resumeFileName]);

  return (
    <div className="min-h-screen overflow-hidden">
      <Toast toast={toast} onDismiss={() => setToast(null)} />
      <div className="grid-texture relative">
        <div className="pointer-events-none absolute left-[-8rem] top-[-8rem] h-80 w-80 rounded-full bg-lime/30 blur-3xl dark:bg-lime/10" /><div className="pointer-events-none absolute right-[-8rem] top-40 h-80 w-80 rounded-full bg-soft-blue/70 blur-3xl dark:bg-cyan-300/5" />
        <Header isDark={isDark} onThemeToggle={() => setIsDark((value) => !value)} />
        <main>
          <section className="mx-auto max-w-5xl px-5 pb-12 pt-14 text-center sm:px-8 sm:pb-16 sm:pt-20">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
              <Badge className="gap-2 border-moss/15 bg-white/50 text-moss dark:border-lime/20 dark:text-lime"><LockKeyhole size={13} /> No sign-up. No server. No nonsense.</Badge>
              <h1 className="text-balance mx-auto mt-6 max-w-4xl font-display text-5xl font-extrabold leading-[1.02] tracking-[-0.065em] sm:text-6xl lg:text-[5.3rem]">ATS Resume <span className="relative whitespace-nowrap text-moss dark:text-lime">Match Analyzer<span className="absolute -bottom-1 left-0 -z-10 h-2 w-full rounded-full bg-lime/70 dark:bg-moss/70" /></span></h1>
              <p className="text-balance mx-auto mt-6 max-w-2xl text-base leading-7 text-ink/60 sm:text-lg dark:text-white/60">Check how well your resume matches a job description in seconds—and learn exactly where to improve.</p>
              <a href="#analyzer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-bold text-white shadow-card transition-transform hover:-translate-y-0.5 dark:bg-lime dark:text-ink">Analyze Resume <ArrowDown size={16} /></a>
            </motion.div>
          </section>
          <AnalyzerCard file={file} jobDescription={jobDescription} isParsing={isParsing} isAnalyzing={isAnalyzing} fileError={fileError} onFile={handleFile} onClearFile={clearResume} onJobDescription={setJobDescription} onAnalyze={handleAnalyze} canAnalyze={Boolean(rawResumeText && normalizedResumeText && resumeFileName && resumeFileType && jobDescription.trim() && !isParsing)} />
          <AnimatePresence>{result && <div id="results"><Suspense fallback={<SectionLoader />}><ResultsPanel result={result} onReset={reset} onExport={handleExport} /></Suspense></div>}</AnimatePresence>
          <Suspense fallback={<SectionLoader />}><Features /></Suspense>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;

