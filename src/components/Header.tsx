import { FileSearch2, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Badge } from "./ui/Badge";

interface HeaderProps {
  isDark: boolean;
  onThemeToggle: () => void;
}

export function Header({ isDark, onThemeToggle }: HeaderProps) {
  return (
    <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
      <a href="#" className="flex items-center gap-3 rounded-full" aria-label="Matchwise home">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-ink text-lime dark:bg-lime dark:text-ink">
          <FileSearch2 size={20} strokeWidth={2.4} />
        </span>
        <span className="font-display text-lg font-extrabold tracking-[-0.03em]">Matchwise</span>
      </a>
      <div className="flex items-center gap-3">
        <Badge className="hidden gap-1.5 sm:inline-flex">
          <ShieldCheck size={14} className="text-moss dark:text-lime" />
          100% private
        </Badge>
        <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />
      </div>
    </header>
  );
}
