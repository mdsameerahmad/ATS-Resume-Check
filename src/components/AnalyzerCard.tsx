import { memo, useMemo } from "react";
import { ArrowRight, BriefcaseBusiness, FileUp, LoaderCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { ResumeUpload } from "./ResumeUpload";
import { Button } from "./ui/Button";

interface AnalyzerCardProps {
  file: File | null;
  jobDescription: string;
  isParsing: boolean;
  isAnalyzing: boolean;
  fileError: string;
  onFile: (file: File) => void;
  onClearFile: () => void;
  onJobDescription: (value: string) => void;
  onAnalyze: () => void;
  canAnalyze: boolean;
}

export const AnalyzerCard = memo(function AnalyzerCard(props: AnalyzerCardProps) {
  const jobWordCount = useMemo(() => props.jobDescription.trim().split(/\s+/).filter(Boolean).length, [props.jobDescription]);

  return (
    <motion.section id="analyzer" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.65 }} className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8" aria-labelledby="analyzer-title">
      <div className="overflow-hidden rounded-[2rem] border bg-white/90 shadow-soft backdrop-blur-xl transition-shadow duration-300 hover:shadow-[0_30px_80px_-38px_rgba(24,42,35,0.42)] dark:bg-[#17211c]/95">
        <div className="grid lg:grid-cols-2">
          <div className="p-5 sm:p-8 lg:p-10">
            <div className="mb-6 flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-soft-blue text-moss dark:bg-lime/10 dark:text-lime"><FileUp size={18} /></span>
              <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-ink/45 dark:text-white/45">Step 01</p><h2 id="analyzer-title" className="font-display text-xl font-bold">Upload your resume</h2></div>
            </div>
            <ResumeUpload file={props.file} isParsing={props.isParsing} error={props.fileError} onFile={props.onFile} onClear={props.onClearFile} />
          </div>
          <div className="border-t p-5 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
            <div className="mb-6 flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#f5e8d4] text-[#8c5b28] dark:bg-orange-400/10 dark:text-orange-300"><BriefcaseBusiness size={18} /></span>
              <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-ink/45 dark:text-white/45">Step 02</p><h2 className="font-display text-xl font-bold">Add the job description</h2></div>
            </div>
            <label htmlFor="job-description" className="sr-only">Job description</label>
            <textarea id="job-description" value={props.jobDescription} onChange={(event) => props.onJobDescription(event.target.value)} placeholder="Paste job description here..." className="min-h-64 w-full resize-none rounded-[1.75rem] border bg-white/35 p-5 text-[15px] leading-7 transition-colors placeholder:text-ink/35 hover:border-moss/50 dark:bg-white/[0.025] dark:placeholder:text-white/30 dark:hover:border-lime/50" />
            <div className="mt-2 flex justify-end text-xs font-medium text-ink/40 dark:text-white/40">{jobWordCount} words</div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 border-t bg-[#f1f4ed] px-5 py-5 sm:flex-row sm:px-8 dark:bg-black/15">
          <p className="flex items-center gap-2 text-sm text-ink/55 dark:text-white/55"><Sparkles size={16} className="text-moss dark:text-lime" />Your files never leave this browser.</p>
          <Button className="w-full px-7 sm:w-auto" onClick={props.onAnalyze} disabled={!props.canAnalyze || props.isAnalyzing} aria-busy={props.isAnalyzing}>
            {props.isAnalyzing ? <><LoaderCircle size={17} className="animate-spin" /> Analyzing…</> : <>Analyze my resume <ArrowRight size={17} /></>}
          </Button>
        </div>
      </div>
    </motion.section>
  );
});
