import { useState } from "react";
import { X } from "lucide-react";
import { site } from "@/config/site";

/**
 * A deliberately visible marker that this build contains placeholder copy.
 * Disable via site.contentNotice.enabled once approved content is in place.
 */
export function ContentNotice() {
  const [visible, setVisible] = useState<boolean>(site.contentNotice.enabled);

  if (!site.contentNotice.enabled || !visible) return null;

  return (
    <div className="relative z-40 border-b border-ember/25 bg-ember/[0.07]">
      <div className="container-page flex items-start gap-3 py-2.5 pr-10">
        <span
          aria-hidden="true"
          className="mt-[7px] size-1.5 shrink-0 rounded-full bg-ember"
        />
        <p className="text-[12px] leading-relaxed text-muted">
          <span className="font-medium text-bone">Preview content.</span>{" "}
          {site.contentNotice.message}
        </p>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2 text-muted transition-colors hover:text-bone"
          aria-label="Dismiss preview notice"
        >
          <X className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
