import { motion } from "framer-motion";

interface ATSScoreGaugeProps {
  score: number;
}

export function ATSScoreGauge({ score }: ATSScoreGaugeProps) {
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);
  const label = score >= 80 ? "Excellent match" : score >= 60 ? "Strong potential" : score >= 40 ? "Needs tailoring" : "Low match";

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative h-48 w-48" role="img" aria-label={`ATS score ${score} percent, ${label}`}>
        <svg className="h-full w-full -rotate-90" viewBox="0 0 176 176" aria-hidden="true">
          <circle cx="88" cy="88" r={radius} fill="none" stroke="currentColor" strokeWidth="13" className="text-white/10 dark:text-black/10" />
          <motion.circle
            cx="88"
            cy="88"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="13"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-lime dark:text-moss"
          />
        </svg>
        <div className="absolute inset-0 grid place-content-center">
          <div><span className="font-display text-5xl font-extrabold tracking-[-0.07em]">{score}</span><span className="text-xl font-bold opacity-50">%</span></div>
          <span className="mt-1 text-xs font-bold uppercase tracking-[0.14em] opacity-55">ATS score</span>
        </div>
      </div>
      <span className="mt-3 rounded-full bg-lime px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-ink">{label}</span>
    </div>
  );
}
