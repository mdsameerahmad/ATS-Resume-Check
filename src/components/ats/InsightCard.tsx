import type { ReactNode } from "react";

interface InsightCardProps {
  icon: ReactNode;
  title: string;
  items: string[];
  emptyText: string;
  variant?: "success" | "warning" | "advice";
}

export function InsightCard({ icon, title, items, emptyText, variant = "success" }: InsightCardProps) {
  const iconColor = variant === "success" ? "text-lime dark:text-moss" : variant === "warning" ? "text-orange-300 dark:text-orange-700" : "text-cyan-200 dark:text-cyan-800";
  return (
    <article className="rounded-3xl bg-white/[0.07] p-5 dark:bg-black/[0.055]">
      <h3 className="mb-4 flex items-center gap-2 font-bold"><span className={iconColor}>{icon}</span>{title}</h3>
      {variant === "advice" ? (
        <ul className="space-y-3">
          {items.map((item) => <li key={item} className="flex gap-2 text-sm leading-6 text-white/70 dark:text-ink/70"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-lime dark:bg-moss" />{item}</li>)}
        </ul>
      ) : (
        <div className="flex flex-wrap gap-2">
          {items.length ? items.map((item) => <span key={item} className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold dark:border-black/10 dark:bg-black/5">{item}</span>) : <span className="text-sm opacity-45">{emptyText}</span>}
        </div>
      )}
    </article>
  );
}
