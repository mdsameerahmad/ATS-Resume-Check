import { ArrowUpRight, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
        <div>
          <p className="font-display font-bold">Crafted by Md Sameer Ahmad</p>
          <a className="mt-1 inline-block text-sm text-ink/50 hover:text-moss dark:text-white/50 dark:hover:text-lime" href="mailto:YOUR_EMAIL">
            mohammadsameerahmad2005@gmail.com
          </a>
        </div>
        <a
          href="https://digitalheroesco.com"
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-fit items-center gap-2 rounded-full border bg-white/50 px-4 py-2.5 text-sm font-bold transition-colors hover:bg-white dark:bg-white/5 dark:hover:bg-white/10"
        >
          <Heart size={15} className="fill-current text-moss dark:text-lime" />
          Built for Digital Heroes
          <ArrowUpRight size={15} />
        </a>
      </div>
    </footer>
  );
}
