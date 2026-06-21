import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("inline-flex items-center rounded-full border bg-white/60 px-3 py-1 text-xs font-bold tracking-wide dark:bg-white/5", className)}
      {...props}
    />
  );
}
