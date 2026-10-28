import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/cn";

type Tone = "info" | "success" | "error";

interface StatusMessageProps {
  tone?: Tone;
  title?: string;
  children: ReactNode;
  className?: string;
  id?: string;
}

const styles: Record<Tone, string> = {
  info: "border-line-strong bg-surface/70 text-bone",
  success: "border-success/40 bg-success/[0.07] text-bone",
  error: "border-danger/45 bg-danger/[0.07] text-bone",
};

const icons = {
  info: Info,
  success: CheckCircle2,
  error: AlertTriangle,
};

export function StatusMessage({
  tone = "info",
  title,
  children,
  className,
  id,
}: StatusMessageProps) {
  const Icon = icons[tone];
  return (
    <div
      id={id}
      role={tone === "error" ? "alert" : "status"}
      aria-live={tone === "error" ? "assertive" : "polite"}
      className={cn(
        "flex gap-3 rounded-md border px-4 py-3.5 text-sm leading-relaxed",
        styles[tone],
        className,
      )}
    >
      <Icon
        className={cn(
          "mt-0.5 size-4 shrink-0",
          tone === "success" && "text-success",
          tone === "error" && "text-danger",
          tone === "info" && "text-muted",
        )}
        aria-hidden="true"
        strokeWidth={1.7}
      />
      <div className="min-w-0">
        {title && <p className="font-medium text-bone">{title}</p>}
        <div className={cn("text-muted", title && "mt-1")}>{children}</div>
      </div>
    </div>
  );
}
