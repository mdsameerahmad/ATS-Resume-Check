import { FileLock2, Gauge, WandSparkles } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: FileLock2,
    title: "Private by design",
    description: "Your resume is processed locally. No accounts, uploads, or hidden data collection.",
    color: "bg-soft-blue text-moss dark:bg-cyan-300/10 dark:text-cyan-200",
  },
  {
    icon: Gauge,
    title: "Instant clarity",
    description: "See your match score and the most important keyword gaps in a few seconds.",
    color: "bg-lime/50 text-moss dark:bg-lime/10 dark:text-lime",
  },
  {
    icon: WandSparkles,
    title: "Actionable guidance",
    description: "Get focused suggestions you can use without inventing skills or gaming the system.",
    color: "bg-[#f5e8d4] text-[#8c5b28] dark:bg-orange-300/10 dark:text-orange-200",
  },
];

export function Features() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
      <div className="mb-10 max-w-2xl">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-moss dark:text-lime">A better first pass</p>
        <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.045em] sm:text-4xl">Built to help you focus on what matters.</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {features.map((feature, index) => (
          <motion.article
            key={feature.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: index * 0.08 }}
            className="rounded-[1.75rem] border bg-white/55 p-6 shadow-card dark:bg-white/[0.035]"
          >
            <span className={`grid h-11 w-11 place-items-center rounded-2xl ${feature.color}`}>
              <feature.icon size={21} />
            </span>
            <h3 className="mt-5 font-display text-lg font-bold">{feature.title}</h3>
            <p className="mt-2 text-sm leading-6 text-ink/60 dark:text-white/60">{feature.description}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
