import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Clock,
  FileCheck2,
  FileSignature,
  KeyRound,
  Lock,
  Send,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { site, hasContractApi } from "@/config/site";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { ContractLookup } from "@/components/forms/ContractLookup";
import { cn } from "@/lib/cn";

const workflow = [
  {
    icon: FileSignature,
    title: "Authorised team creates the contract",
    body: "An authorised member of Actora LLC prepares the agreement and uploads it to the e-signature provider. Drafts are never published on this website.",
  },
  {
    icon: KeyRound,
    title: "The document is linked to one client",
    body: "The signing request is addressed to the named client and their email. The provider issues a unique, expiring signing link.",
  },
  {
    icon: Send,
    title: "The client receives a secure link",
    body: "The provider emails the signing link directly. The link is single-purpose, time-limited and not guessable or indexed.",
  },
  {
    icon: FileCheck2,
    title: "The client reviews and signs",
    body: "Signing happens on the provider's hosted page with its own consent, audit trail and identity checks. Actora never collects signatures here.",
  },
  {
    icon: ShieldCheck,
    title: "Status is confirmed by the provider",
    body: "Signed webhooks are verified by our server before status changes are recorded. A status only becomes “signed” on a provider-confirmed event.",
  },
  {
    icon: Lock,
    title: "The executed copy is retained",
    body: "Actora retrieves the executed document from the provider. The client can also download their copy from the provider's confirmation email.",
  },
];

const statuses = [
  { status: "Draft", icon: FileSignature, body: "Prepared internally; not yet sent." },
  { status: "Sent", icon: Send, body: "Signing request issued to the client." },
  { status: "Viewed", icon: Clock, body: "Opened by the client at the provider." },
  { status: "Signed", icon: CheckCircle2, body: "Provider-confirmed completion." },
  { status: "Declined", icon: XCircle, body: "Client declined the request." },
  { status: "Expired", icon: Clock, body: "Link expired before completion." },
];

export function Contracts() {
  return (
    <>
      <PageHeader
        eyebrow="Contracts"
        title={
          <>
            Paperwork, without the{" "}
            <span className="serif-accent">theatre</span>.
          </>
        }
        intro="How Actora LLC issues, signs and stores client agreements. Contracts are handled through a dedicated e-signature provider — never emailed as attachments, never collected through this website."
        meta={
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
              Provider · {site.integrations.signatureProvider}
            </span>
            <span className="rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
              Audit trail included
            </span>
          </div>
        }
      />

      <section className="pb-20" aria-labelledby="workflow-heading">
        <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal>
              <h2 id="workflow-heading" className="label">
                The signing workflow
              </h2>
            </Reveal>
            <ol className="mt-8">
              {workflow.map((step, index) => {
                const Icon = step.icon;
                return (
                  <Reveal key={step.title} as="li" delay={index * 40}>
                    <div className="flex gap-5 border-t border-line py-6">
                      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border border-line text-ember">
                        <Icon className="size-4" aria-hidden="true" strokeWidth={1.6} />
                      </span>
                      <div>
                        <h3 className="text-[15px] font-medium leading-snug text-bone">
                          {step.title}
                        </h3>
                        <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-muted">
                          {step.body}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </ol>

            <div className="mt-10 rounded-lg border border-line bg-ink-raised p-6">
              <h3 className="label text-faint">Status meanings</h3>
              <dl className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {statuses.map((entry) => (
                  <div key={entry.status}>
                    <dt className="flex items-center gap-2 text-sm text-bone">
                      <entry.icon className="size-3.5 text-ember" aria-hidden="true" strokeWidth={1.6} />
                      {entry.status}
                    </dt>
                    <dd className="mt-1 text-[12px] leading-snug text-muted">
                      {entry.body}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-8">
              <StatusMessage tone="info" title="Legal review recommended">
                An e-signature confirms the process, not the adequacy of the
                agreement. We recommend independent legal review before signing,
                and we make no claim that a document is legally binding merely
                because a signature was requested.
              </StatusMessage>
            </div>
          </div>

          <aside className="lg:col-span-5" id="signing">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <div className="rounded-lg border border-line bg-ink-raised p-6 md:p-7">
                  <ContractLookup />
                </div>
              </Reveal>

              <Reveal delay={80}>
                <div className="mt-6 rounded-lg border border-line p-6">
                  <h2 className="flex items-center gap-2 text-sm font-medium text-bone">
                    <Lock className="size-4 text-ember" aria-hidden="true" strokeWidth={1.6} />
                    How this is protected
                  </h2>
                  <ul className="mt-4 space-y-2.5 text-[12.5px] leading-relaxed text-muted">
                    <li>No public contract directory or predictable URLs.</li>
                    <li>Signing links are issued and expired by the provider.</li>
                    <li>Status changes require verified provider webhooks.</li>
                    <li>Provider credentials stay in server-side secrets.</li>
                    <li>No signatures or ID documents through ordinary forms.</li>
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={120}>
                <div
                  className={cn(
                    "mt-6 rounded-lg border p-6",
                    hasContractApi
                      ? "border-success/35 bg-success/[0.05]"
                      : "border-line bg-ink",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "size-1.5 rounded-full",
                        hasContractApi ? "bg-success" : "bg-ember",
                      )}
                    />
                    <h2 className="label text-bone">
                      {hasContractApi
                        ? "Status API connected"
                        : "Integration not configured"}
                    </h2>
                  </div>
                  {hasContractApi ? (
                    <p className="mt-3 text-[12.5px] leading-relaxed text-muted">
                      The contract status endpoint is configured for this build.
                      Lookup results are read-only and return status metadata only.
                    </p>
                  ) : (
                    <>
                      <p className="mt-3 text-[12.5px] leading-relaxed text-muted">
                        No contract provider or API endpoint is connected to this
                        build, so signing and status lookup are intentionally
                        unavailable. No simulated signing flow is provided.
                      </p>
                      <ol className="mt-4 space-y-2 text-[12px] leading-relaxed text-faint">
                        <li>1. Create a {site.integrations.signatureProvider} account and API key.</li>
                        <li>2. Deploy the server in <code>/server</code> with the provider secrets set.</li>
                        <li>3. Register the webhook URL and verify its signing secret.</li>
                        <li>4. Set <code>VITE_CONTRACT_API_ENDPOINT</code> at build time.</li>
                      </ol>
                      <p className="mt-3 text-[11px] text-faint">
                        Full instructions: <code>docs/INTEGRATIONS.md</code>.
                      </p>
                    </>
                  )}
                </div>
              </Reveal>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-t border-line py-16 md:py-20" aria-labelledby="provider-heading">
        <div className="container-page grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal>
              <h2 id="provider-heading" className="label">
                Provider disclosure
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-8">
            <Reveal delay={50}>
              <div className="max-w-2xl space-y-5 text-sm leading-relaxed text-muted">
                <p className="text-base leading-relaxed text-bone">
                  {site.integrations.signatureProviderDisclosure}
                </p>
                <p>
                  The provider processes the document, your email address, signature
                  and associated audit data under its own terms and privacy policy.
                  Actora LLC receives the document, its status and the audit trail.
                </p>
                <p>
                  E-signature services can charge per envelope or per user and their
                  plans change. Before a signing request is issued, ask us for the
                  current cost treatment — we will confirm it in writing rather than
                  estimate here.
                </p>
                <p>
                  Questions about a contract? Email{" "}
                  <a
                    href={`mailto:${site.email.contracts}`}
                    className="link-underline text-bone"
                  >
                    {site.email.contracts}
                  </a>{" "}
                  or read the{" "}
                  <Link to="/privacy" className="link-underline text-bone">
                    privacy policy
                  </Link>
                  .
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
