import { memo, useState } from "react";
import { CheckCircle2, Download, Lightbulb, LoaderCircle, RotateCcw, TriangleAlert } from "lucide-react";
import { motion } from "framer-motion";
import type { AnalysisResult } from "../lib/analyzer";
import { ATSScoreGauge } from "./ats/ATSScoreGauge";
import { InsightCard } from "./ats/InsightCard";
import { Button } from "./ui/Button";

interface ResultsPanelProps {
  result: AnalysisResult;
  onExport: () => Promise<void>;
  onReset: () => void;
}

export const ResultsPanel = memo(function ResultsPanel({ result, onExport, onReset }: ResultsPanelProps) {
  const [isExporting, setIsExporting] = useState(false);
  const handleExport = async () => {
    setIsExporting(true);
    try { await onExport(); } finally { setIsExporting(false); }
  };

  return (
    <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-6xl px-5 py-12 sm:px-8" aria-live="polite">
      <div className="rounded-[2rem] bg-ink p-6 text-white shadow-soft sm:p-10 dark:bg-[#edf3ec] dark:text-ink">
        <div className="grid items-center gap-10 lg:grid-cols-[0.62fr_1.38fr]">
          <div><ATSScoreGauge score={result.atsScore} /><p className="mx-auto mt-5 max-w-sm text-center text-sm leading-6 text-white/65 dark:text-ink/65">{result.summary}</p><p className="mt-3 text-center text-xs font-semibold uppercase tracking-[0.12em] text-white/40 dark:text-ink/40">{result.matchedSkills.length} of {result.totalKeywords} job skills matched</p></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <InsightCard icon={<CheckCircle2 size={18} />} title="Matched skills" items={result.matchedSkills} emptyText="No recognized matches yet" />
            <InsightCard icon={<TriangleAlert size={18} />} title="Missing skills" items={result.missingSkills} emptyText="No technical gaps found" variant="warning" />
            <div className="sm:col-span-2"><InsightCard icon={<Lightbulb size={18} />} title="Recommendations" items={result.recommendations} emptyText="No recommendations" variant="advice" /></div>
          </div>
        </div>
        <div className="mt-8 flex flex-col justify-between gap-4 border-t border-white/15 pt-6 sm:flex-row sm:items-center dark:border-black/10">
          <div className="flex flex-wrap gap-5 text-sm text-white/55 dark:text-ink/55"><span><strong className="text-white dark:text-ink">{result.resumeWordCount}</strong> resume words</span><span><strong className="text-white dark:text-ink">{result.jobWordCount}</strong> job words</span></div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="ghost" className="text-white hover:bg-white/10 dark:text-ink dark:hover:bg-black/5" onClick={onReset}><RotateCcw size={16} /> Start over</Button>
            <Button className="bg-lime text-ink hover:-translate-y-0.5 hover:bg-[#d7fa88] dark:bg-ink dark:text-white" onClick={handleExport} disabled={isExporting} aria-busy={isExporting}>
              {isExporting ? <><LoaderCircle size={16} className="animate-spin" /> Generating…</> : <><Download size={16} /> Download report</>}
            </Button>
          </div>
        </div>
      </div>
    </motion.section>
  );
});
