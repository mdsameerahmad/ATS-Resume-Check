import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

export interface ToastMessage { id: number; message: string; variant: "success" | "error"; }

export function Toast({ toast, onDismiss }: { toast: ToastMessage | null; onDismiss: () => void }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} role={toast.variant === "error" ? "alert" : "status"} aria-live={toast.variant === "error" ? "assertive" : "polite"} className="fixed left-1/2 top-5 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-2xl border bg-white p-4 text-sm font-semibold text-ink shadow-soft dark:bg-[#17211c] dark:text-white">
          {toast.variant === "success" ? <CheckCircle2 className="shrink-0 text-moss dark:text-lime" size={20} /> : <AlertCircle className="shrink-0 text-red-600 dark:text-red-400" size={20} />}
          <span className="flex-1">{toast.message}</span>
          <button type="button" onClick={onDismiss} aria-label="Dismiss notification" className="grid h-8 w-8 shrink-0 place-items-center rounded-full hover:bg-black/5 dark:hover:bg-white/10"><X size={16} /></button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
