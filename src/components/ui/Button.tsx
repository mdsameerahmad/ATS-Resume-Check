import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-bold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-45",
        variant === "primary" && "bg-ink text-white shadow-card hover:-translate-y-0.5 hover:bg-moss dark:bg-lime dark:text-ink dark:hover:bg-[#d7fa88]",
        variant === "secondary" && "border bg-white/70 text-ink hover:bg-white dark:bg-white/5 dark:text-white dark:hover:bg-white/10",
        variant === "ghost" && "text-ink hover:bg-black/5 dark:text-white dark:hover:bg-white/10",
        className,
      )}
      {...props}
    />
  ),
);

Button.displayName = "Button";
