import { useId, useRef, useState, type ChangeEvent, type DragEvent, type KeyboardEvent } from "react";
import { CheckCircle2, FileText, LoaderCircle, UploadCloud, X } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./ui/Button";

interface ResumeUploadProps { file: File | null; isParsing: boolean; error: string; onFile: (file: File) => void; onClear: () => void; }

export function ResumeUpload({ file, isParsing, error, onFile, onClear }: ResumeUploadProps) {
  const [dragDepth, setDragDepth] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const helpId = `${inputId}-help`;
  const errorId = `${inputId}-error`;
  const openPicker = () => { if (!isParsing) inputRef.current?.click(); };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openPicker(); }
  };
  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault(); setDragDepth(0);
    if (!isParsing && event.dataTransfer.files[0]) onFile(event.dataTransfer.files[0]);
  };
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0]; if (selected) onFile(selected); event.target.value = "";
  };

  if (file) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-[1.75rem] border border-moss/20 bg-moss/[0.04] p-6 text-center dark:border-lime/20 dark:bg-lime/[0.04]" aria-busy={isParsing}>
        <span className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-white shadow-card dark:bg-white/10" aria-hidden="true">{isParsing ? <LoaderCircle className="animate-spin" /> : <CheckCircle2 className="text-moss dark:text-lime" />}</span>
        <p className="max-w-full break-all font-bold">{file.name}</p>
        <p className="mt-1 text-sm text-ink/55 dark:text-white/55">{(file.size / 1024 / 1024).toFixed(2)} MB · {isParsing ? "Reading resume…" : "Ready to analyze"}</p>
        <Button variant="ghost" className="mt-4" onClick={onClear} disabled={isParsing}><X size={16} aria-hidden="true" /> Remove</Button>
      </div>
    );
  }

  const isDragging = dragDepth > 0;
  return (
    <>
      <div role="button" tabIndex={0} onClick={openPicker} onKeyDown={onKeyDown}
        onDragEnter={(event) => { event.preventDefault(); setDragDepth((value) => value + 1); }}
        onDragLeave={(event) => { event.preventDefault(); setDragDepth((value) => Math.max(0, value - 1)); }}
        onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = "copy"; }} onDrop={onDrop}
        className={cn("group flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-[1.75rem] border border-dashed p-6 text-center transition-all", isDragging ? "scale-[1.01] border-moss bg-moss/5 dark:border-lime dark:bg-lime/5" : "border-black/20 bg-white/35 hover:border-moss hover:bg-white/70 dark:border-white/20 dark:bg-white/[0.025] dark:hover:border-lime dark:hover:bg-white/5")}
        aria-controls={inputId} aria-describedby={`${helpId}${error ? ` ${errorId}` : ""}`}>
        <span className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-white shadow-card transition-transform group-hover:-translate-y-1 dark:bg-white/10" aria-hidden="true"><UploadCloud className="text-moss dark:text-lime" /></span>
        <p className="font-bold">Drop your resume here</p><p className="mt-1 text-sm text-ink/55 dark:text-white/55">or click to browse your files</p>
        <span id={helpId} className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.13em] text-ink/45 dark:text-white/45"><FileText size={14} aria-hidden="true" /> PDF or TXT · Max 5 MB</span>
      </div>
      <input id={inputId} ref={inputRef} type="file" accept=".pdf,.txt,application/pdf,text/plain" className="sr-only" onChange={onChange} aria-describedby={`${helpId}${error ? ` ${errorId}` : ""}`} />
      {error && <p id={errorId} role="alert" className="mt-3 text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}
    </>
  );
}
