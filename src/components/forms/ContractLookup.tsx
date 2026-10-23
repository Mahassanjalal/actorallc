import { useState, type FormEvent } from "react";
import { CheckCircle2, Clock, FileSignature, Lock, XCircle } from "lucide-react";
import { site, hasContractApi } from "@/config/site";
import { ApiError, fetchContractStatus, type ContractStatus, type ContractStatusResult } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { TextField } from "@/components/forms/Fields";

const statusCopy: Record<
  ContractStatus,
  { label: string; description: string; tone: string }
> = {
  draft: {
    label: "Draft",
    description:
      "The contract is being prepared. It has not been sent to you yet.",
    tone: "text-muted border-line-strong",
  },
  sent: {
    label: "Sent",
    description:
      "The signing request has been issued. Check your email for the secure provider link.",
    tone: "text-ice border-ice/40",
  },
  viewed: {
    label: "Viewed",
    description:
      "The document has been opened in the signing provider. Review it carefully before signing.",
    tone: "text-ice border-ice/40",
  },
  signed: {
    label: "Signed",
    description:
      "The provider has confirmed a completed signature. The executed copy is available from the provider and from Actora.",
    tone: "text-success border-success/40",
  },
  declined: {
    label: "Declined",
    description:
      "The signature request was declined. Contact Actora to discuss the next step.",
    tone: "text-danger border-danger/40",
  },
  expired: {
    label: "Expired",
    description:
      "The signing link expired before completion. Actora can issue a new request.",
    tone: "text-ember-soft border-ember/40",
  },
};

function StatusIcon({ status }: { status: ContractStatus }) {
  if (status === "signed") {
    return <CheckCircle2 className="size-5" aria-hidden="true" strokeWidth={1.7} />;
  }
  if (status === "declined") {
    return <XCircle className="size-5" aria-hidden="true" strokeWidth={1.7} />;
  }
  if (status === "expired") {
    return <Clock className="size-5" aria-hidden="true" strokeWidth={1.7} />;
  }
  if (status === "viewed") {
    return <FileSignature className="size-5" aria-hidden="true" strokeWidth={1.7} />;
  }
  return <Lock className="size-5" aria-hidden="true" strokeWidth={1.7} />;
}

export function ContractLookup() {
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<ContractStatusResult | null>(null);
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState<string | undefined>();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = token.trim();
    if (trimmed.length < 16) {
      setFieldError("Enter the full access token from your signing email.");
      return;
    }
    setFieldError(undefined);
    setStatus("loading");
    setError("");
    setResult(null);

    try {
      const data = await fetchContractStatus(trimmed);
      setResult(data);
      setStatus("done");
    } catch (caught) {
      setStatus("error");
      setError(
        caught instanceof ApiError
          ? caught.message
          : "We could not retrieve the contract status.",
      );
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <Lock className="size-4 text-ember" aria-hidden="true" strokeWidth={1.6} />
        <h2 id="contract-status" className="text-lg tracking-[-0.02em] text-bone">
          Contract status lookup
        </h2>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Your signing email contains a private access token. Token holders can
        check status here; no contract contents are shown on this page.
      </p>

      {!hasContractApi && (
        <StatusMessage tone="info" className="mt-5" title="Status service not connected">
          The contract service has not been configured for this build. See
          <code className="mx-1">docs/INTEGRATIONS.md</code>
          for the server setup, provider credentials and webhook verification.
        </StatusMessage>
      )}

      <form onSubmit={onSubmit} noValidate className="mt-6">
        <TextField
          id="contract-token"
          label="Access token"
          value={token}
          onChange={(value) => {
            setToken(value);
            setFieldError(undefined);
          }}
          placeholder="Paste the token from your signing email"
          hint="Never share this token"
          error={fieldError}
          disabled={!hasContractApi || status === "loading"}
          autoComplete="off"
        />
        <div className="mt-6">
          <Button
            type="submit"
            variant="secondary"
            loading={status === "loading"}
            loadingLabel="Checking"
            disabled={!hasContractApi}
            showArrow
          >
            Check status
          </Button>
        </div>
      </form>

      {status === "error" && (
        <StatusMessage tone="error" className="mt-6" title="Status unavailable">
          {error}
        </StatusMessage>
      )}

      {status === "done" && result && (
        <div className="mt-6 rounded-md border border-line bg-ink-raised p-5" role="status">
          <div
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium",
              statusCopy[result.status].tone,
            )}
          >
            <StatusIcon status={result.status} />
            {statusCopy[result.status].label}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            {statusCopy[result.status].description}
          </p>
          <dl className="mt-5 grid gap-3 border-t border-line pt-4 text-xs sm:grid-cols-2">
            <div>
              <dt className="uppercase tracking-[0.14em] text-faint">Provider</dt>
              <dd className="mt-1 text-bone">{result.provider}</dd>
            </div>
            {result.updatedAt && (
              <div>
                <dt className="uppercase tracking-[0.14em] text-faint">
                  Last update
                </dt>
                <dd className="mt-1 text-bone">{formatDate(result.updatedAt)}</dd>
              </div>
            )}
          </dl>
          <p className="mt-4 text-[11px] leading-relaxed text-faint">
            Need help? Email{" "}
            <a
              className="link-underline text-muted hover:text-bone"
              href={`mailto:${site.email.contracts}`}
            >
              {site.email.contracts}
            </a>
            . Never send identity documents or signatures by ordinary email.
          </p>
        </div>
      )}
    </div>
  );
}
