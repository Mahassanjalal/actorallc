/**
 * Actora API — Cloudflare Worker reference implementation.
 *
 * Routes
 *   POST /api/inquiries              public contact / project inquiry
 *   POST /api/contracts/status       public, token-based status lookup
 *   POST /api/contracts/register     admin-only: map a provider request to a token
 *   POST /api/webhooks/dropbox-sign  provider webhook (signature verified)
 *   GET  /healthz                    readiness (no secrets returned)
 *
 * Secrets (set with `wrangler secret put`, never in this file):
 *   RESEND_API_KEY, FROM_EMAIL, INQUIRY_TO_EMAIL, ALLOWED_ORIGINS,
 *   AUTO_REPLY, ADMIN_TOKEN, DROPBOX_SIGN_API_KEY
 *
 * Bindings: RATE_LIMIT (KV), CONTRACTS (KV). See docs/INTEGRATIONS.md.
 */

export interface Env {
  RESEND_API_KEY?: string;
  FROM_EMAIL?: string;
  INQUIRY_TO_EMAIL?: string;
  ALLOWED_ORIGINS?: string;
  AUTO_REPLY?: string;
  ADMIN_TOKEN?: string;
  DROPBOX_SIGN_API_KEY?: string;
  RATE_LIMIT?: KVNamespace;
  CONTRACTS?: KVNamespace;
}

interface KVNamespace {
  get(key: string): Promise<string | null>;
  get(key: string, type: "json"): Promise<unknown>;
  put(
    key: string,
    value: string,
    options?: { expirationTtl?: number },
  ): Promise<void>;
  delete(key: string): Promise<void>;
}

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
  "referrer-policy": "no-referrer",
};

const MAX_BODY_BYTES = 20_000;
const RATE_WINDOW_SECONDS = 900;
const RATE_MAX_REQUESTS = 6;

const BUDGETS = new Set([
  "Not sure yet",
  "Under $15,000",
  "$15,000 – $40,000",
  "$40,000 – $80,000",
  "$80,000 – $150,000",
  "$150,000+",
]);
const TIMELINES = new Set([
  "As soon as possible",
  "Within 1–2 months",
  "Within 3–4 months",
  "Later this year",
  "Still exploring",
]);
const PROJECT_TYPES = new Set([
  "Brand & identity",
  "Digital product",
  "Website or platform",
  "Film & motion",
  "Something else",
]);

type InquiryKind = "contact" | "project";

interface InquiryBody {
  kind?: unknown;
  name?: unknown;
  email?: unknown;
  company?: unknown;
  phone?: unknown;
  projectType?: unknown;
  budget?: unknown;
  timeline?: unknown;
  message?: unknown;
  consent?: unknown;
  website?: unknown;
  elapsedMs?: unknown;
  page?: unknown;
}

interface ContractRecord {
  providerRequestId: string;
  status: "draft" | "sent" | "viewed" | "signed" | "declined" | "expired";
  updatedAt: string;
  expiresAt: string;
  clientEmailHash?: string;
}

function json(body: unknown, status = 200, extraHeaders: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...JSON_HEADERS, ...extraHeaders },
  });
}

function normaliseOrigin(origin: string): string {
  return origin.trim().replace(/\/$/, "");
}

function corsHeaders(request: Request, env: Env): Record<string, string> {
  const origin = request.headers.get("Origin");
  if (!origin) return {};
  const allowed = (env.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map(normaliseOrigin)
    .filter(Boolean);
  const isLocal = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

  if (allowed.includes(normaliseOrigin(origin)) || isLocal) {
    return {
      "access-control-allow-origin": origin,
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers": "content-type, authorization",
      "access-control-max-age": "600",
      vary: "Origin",
    };
  }
  return { vary: "Origin" };
}

function isAllowedOrigin(request: Request, env: Env): boolean {
  const origin = request.headers.get("Origin");
  if (!origin) return true; // Non-browser clients: rate limits still apply.
  const allowed = (env.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map(normaliseOrigin)
    .filter(Boolean);
  const isLocal = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  return allowed.includes(normaliseOrigin(origin)) || isLocal;
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function hmacHex(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload),
  );
  return [...new Uint8Array(signature)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let index = 0; index < a.length; index += 1) {
    diff |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return diff === 0;
}

function clean(value: unknown, max = 5000): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .trim()
    .slice(0, max);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function readJson(
  request: Request,
): Promise<{ ok: true; data: Record<string, unknown> } | { ok: false; response: Response }> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return {
      ok: false,
      response: json({ ok: false, error: "Expected a JSON request." }, 415),
    };
  }
  const length = Number(request.headers.get("content-length") ?? "0");
  if (length > MAX_BODY_BYTES) {
    return {
      ok: false,
      response: json({ ok: false, error: "Request is too large." }, 413),
    };
  }
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) {
    return {
      ok: false,
      response: json({ ok: false, error: "Request is too large." }, 413),
    };
  }
  try {
    const parsed: unknown = JSON.parse(text);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Not an object");
    }
    return { ok: true, data: parsed as Record<string, unknown> };
  } catch {
    return {
      ok: false,
      response: json({ ok: false, error: "Malformed JSON body." }, 400),
    };
  }
}

async function rateLimit(
  request: Request,
  env: Env,
  bucket: string,
): Promise<{ allowed: boolean; retryAfter?: number }> {
  if (!env.RATE_LIMIT) {
    // No KV binding: fail closed for forms rather than allowing unlimited abuse.
    return { allowed: false };
  }
  const ip =
    request.headers.get("CF-Connecting-IP") ??
    request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ??
    "unknown";
  const key = `rl:${bucket}:${await sha256Hex(ip)}:${Math.floor(Date.now() / 1000 / RATE_WINDOW_SECONDS)}`;
  const current = Number((await env.RATE_LIMIT.get(key)) ?? "0");
  if (current >= RATE_MAX_REQUESTS) {
    return { allowed: false, retryAfter: RATE_WINDOW_SECONDS };
  }
  await env.RATE_LIMIT.put(key, String(current + 1), {
    expirationTtl: RATE_WINDOW_SECONDS,
  });
  return { allowed: true };
}

function validateInquiry(data: Record<string, unknown>): {
  ok: boolean;
  errors: Record<string, string>;
  value: {
    kind: InquiryKind;
    name: string;
    email: string;
    company: string;
    phone: string;
    projectType: string;
    budget: string;
    timeline: string;
    message: string;
    page: string;
  };
} {
  const errors: Record<string, string> = {};
  const kind: InquiryKind = data.kind === "project" ? "project" : "contact";
  const name = clean(data.name, 120);
  const email = clean(data.email, 254).toLowerCase();
  const company = clean(data.company, 160);
  const phone = clean(data.phone, 40);
  const projectType = clean(data.projectType, 80);
  const budget = clean(data.budget, 80);
  const timeline = clean(data.timeline, 80);
  const message = clean(data.message, 5000);
  const page = clean(data.page, 200);

  if (name.length < 2) errors.name = "A name is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    errors.email = "A valid email address is required.";
  }
  if (phone) {
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 7 || digits.length > 20) errors.phone = "Invalid phone number.";
  }
  if (message.length < 10) errors.message = "A message is required.";
  if (data.consent !== true) errors.consent = "Consent is required.";

  if (kind === "project") {
    if (!PROJECT_TYPES.has(projectType)) errors.projectType = "Choose a project type.";
    if (!BUDGETS.has(budget)) errors.budget = "Choose a budget range.";
    if (!TIMELINES.has(timeline)) errors.timeline = "Choose a timeline.";
    if (message.length < 20) errors.message = "Please describe the project.";
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    value: {
      kind,
      name,
      email,
      company,
      phone,
      projectType,
      budget,
      timeline,
      message,
      page,
    },
  };
}

function emailBody(
  value: ReturnType<typeof validateInquiry>["value"],
  id: string,
): string {
  const rows: Array<[string, string]> = [
    ["Type", value.kind],
    ["Name", value.name],
    ["Email", value.email],
    ["Company", value.company || "—"],
    ["Phone", value.phone || "—"],
    ["Project type", value.projectType || "—"],
    ["Budget", value.budget || "—"],
    ["Timeline", value.timeline || "—"],
    ["Page", value.page || "—"],
    ["Reference", id],
  ];
  const table = rows
    .map(
      ([label, entry]) =>
        `<tr><th align="left" style="padding:6px 16px 6px 0;color:#6b7280;font-weight:600;white-space:nowrap">${escapeHtml(label)}</th><td style="padding:6px 0">${escapeHtml(entry)}</td></tr>`,
    )
    .join("");
  return `<div style="font-family:-apple-system,Segoe UI,sans-serif;max-width:640px;color:#111">
  <h1 style="font-size:20px;margin:0 0 16px">New ${value.kind} inquiry · Actora</h1>
  <table style="border-collapse:collapse;font-size:14px">${table}</table>
  <h2 style="font-size:14px;margin:24px 0 8px">Message</h2>
  <pre style="white-space:pre-wrap;font:14px/1.6 ui-monospace,monospace;background:#f6f6f6;padding:16px;border-radius:8px">${escapeHtml(value.message)}</pre>
</div>`;
}

async function resend(
  env: Env,
  payload: {
    from: string;
    to: string[];
    subject: string;
    html: string;
    replyTo?: string;
  },
): Promise<Response> {
  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: payload.from,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      ...(payload.replyTo ? { reply_to: payload.replyTo } : {}),
    }),
  });
}

async function handleInquiry(request: Request, env: Env, cors: Record<string, string>) {
  if (!env.RESEND_API_KEY || !env.FROM_EMAIL || !env.INQUIRY_TO_EMAIL) {
    return json(
      {
        ok: false,
        error:
          "The inquiry service is deployed but email delivery is not configured yet. Please email us directly.",
      },
      503,
      cors,
    );
  }

  const parsed = await readJson(request);
  if (!parsed.ok) return parsed.response;

  const data = parsed.data as InquiryBody;

  if (clean(data.website)) {
    // Honeypot hit: accept without sending, so bots get no signal.
    return json({ ok: true, id: "discarded" }, 200, cors);
  }

  const elapsed = Number(data.elapsedMs ?? 0);
  if (!Number.isFinite(elapsed) || elapsed < 2000 || elapsed > 86_400_000) {
    return json(
      { ok: false, error: "This submission could not be verified. Please reload and try again." },
      422,
      cors,
    );
  }

  const validation = validateInquiry(data as Record<string, unknown>);
  if (!validation.ok) {
    return json({ ok: false, error: "Please review the highlighted fields.", errors: validation.errors }, 422, cors);
  }

  const limit = await rateLimit(request, env, "inquiry");
  if (!limit.allowed) {
    return json(
      { ok: false, error: "Too many submissions from this connection. Please try again later." },
      429,
      { ...cors, "retry-after": String(limit.retryAfter ?? RATE_WINDOW_SECONDS) },
    );
  }

  const id = `ACT-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
  const subject =
    validation.value.kind === "project"
      ? `New project brief — ${validation.value.company || validation.value.name}`
      : `New inquiry — ${validation.value.name}`;

  const sendResult = await resend(env, {
    from: env.FROM_EMAIL,
    to: [env.INQUIRY_TO_EMAIL],
    subject,
    html: emailBody(validation.value, id),
    replyTo: validation.value.email,
  });

  if (!sendResult.ok) {
    return json(
      {
        ok: false,
        error: "We could not deliver your message. Please email us directly so nothing is lost.",
      },
      502,
      cors,
    );
  }

  if (env.AUTO_REPLY === "true") {
    const confirmation = await resend(env, {
      from: env.FROM_EMAIL,
      to: [validation.value.email],
      subject: "We received your message — Actora",
      html: `<div style="font-family:-apple-system,Segoe UI,sans-serif;max-width:560px;color:#111">
  <p>Hello ${escapeHtml(validation.value.name.split(" ")[0] || "there")},</p>   <p>Thank you for writing to Actora. Your message has reached the company and we will reply within two business days.</p>
  <p style="color:#6b7280;font-size:13px">Reference: ${escapeHtml(id)}</p>
  <p>— Actora LLC, Austin, Texas</p>
</div>`,
    });
    // A failed confirmation does not invalidate the received inquiry; the     // company notification already succeeded.
    if (!confirmation.ok) {
      console.warn("confirmation email failed", confirmation.status);
    }
  }

  return json({ ok: true, id }, 200, cors);
}

function contractConfigured(env: Env): boolean {
  return Boolean(env.CONTRACTS && env.DROPBOX_SIGN_API_KEY);
}

async function handleContractStatus(request: Request, env: Env, cors: Record<string, string>) {
  if (!contractConfigured(env)) {
    return json(
      { ok: false, error: "Contract status lookups are not configured on this deployment." },
      503,
      cors,
    );
  }
  const parsed = await readJson(request);
  if (!parsed.ok) return parsed.response;

  const token = clean(parsed.data.token, 200);
  if (!/^[a-f0-9]{48,128}$/i.test(token)) {
    return json({ ok: false, error: "Invalid access token." }, 400, cors);
  }

  const limit = await rateLimit(request, env, "contract-status");
  if (!limit.allowed) {
    return json({ ok: false, error: "Too many lookups. Please try again later." }, 429, cors);
  }

  const record = await env.CONTRACTS!.get(`contract:${await sha256Hex(token)}`, "json");
  if (!record) {
    return json({ ok: false, error: "That link is not recognised." }, 404, cors);
  }
  const contract = record as ContractRecord;
  if (new Date(contract.expiresAt).getTime() < Date.now()) {
    return json({ ok: false, error: "This contract link has expired." }, 410, cors);
  }

  return json(
    {
      status: contract.status,
      updatedAt: contract.updatedAt,
      provider: "Dropbox Sign",
    },
    200,
    cors,
  );
}

async function handleContractRegister(request: Request, env: Env, cors: Record<string, string>) {
  if (!contractConfigured(env) || !env.ADMIN_TOKEN) {
    return json({ ok: false, error: "Contract administration is not configured." }, 503, cors);
  }
  const authorization = request.headers.get("Authorization") ?? "";
  const headerToken = authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : "";
  if (!timingSafeEqual(headerToken, env.ADMIN_TOKEN)) {
    return json({ ok: false, error: "Unauthorised." }, 401, cors);
  }

  const parsed = await readJson(request);
  if (!parsed.ok) return parsed.response;

  const providerRequestId = clean(parsed.data.providerRequestId, 120);
  const clientEmail = clean(parsed.data.clientEmail, 254).toLowerCase();
  const expiresAt = clean(parsed.data.expiresAt, 40);

  if (!/^[A-Za-z0-9_-]{6,120}$/.test(providerRequestId)) {
    return json({ ok: false, error: "A provider request id is required." }, 422, cors);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clientEmail)) {
    return json({ ok: false, error: "A client email is required." }, 422, cors);
  }
  const expiry = new Date(expiresAt);
  if (Number.isNaN(expiry.getTime()) || expiry.getTime() < Date.now()) {
    return json({ ok: false, error: "A future expiry date is required." }, 422, cors);
  }

  const token = [...crypto.getRandomValues(new Uint8Array(32))]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  const record: ContractRecord = {
    providerRequestId,
    status: "sent",
    updatedAt: new Date().toISOString(),
    expiresAt: expiry.toISOString(),
    clientEmailHash: await sha256Hex(clientEmail),
  };

  await env.CONTRACTS!.put(`contract:${await sha256Hex(token)}`, JSON.stringify(record), {
    expirationTtl: Math.max(
      60,
      Math.floor((expiry.getTime() - Date.now()) / 1000) + 7 * 86_400,
    ),
  });
  await env.CONTRACTS!.put(`request:${providerRequestId}`, await sha256Hex(token));

  return json({ ok: true, token }, 201, cors);
}

const DROPBOX_STATUS: Record<string, ContractRecord["status"]> = {
  signature_request_sent: "sent",
  signature_request_viewed: "viewed",
  // One signer completed; the contract is not fully executed yet.
  signature_request_signed: "viewed",
  signature_request_all_signed: "signed",
  signature_request_declined: "declined",
  signature_request_expired: "expired",
};

async function handleWebhook(request: Request, env: Env, cors: Record<string, string>) {
  if (!contractConfigured(env)) {
    return json({ ok: false, error: "Webhook not configured." }, 503, cors);
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return json({ ok: false, error: "Payload too large." }, 413, cors);
  }

  let payload: {
    event?: {
      event_time?: string;
      event_type?: string;
      event_hash?: string;
      signature_request?: { signature_request_id?: string };
    };
  };
  try {
    payload = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "Malformed payload." }, 400, cors);
  }

  const event = payload.event;
  if (!event?.event_time || !event.event_type || !event.event_hash) {
    return json({ ok: false, error: "Missing event fields." }, 400, cors);
  }

  // Dropbox Sign signs event_time + event_type with HMAC-SHA256(api key).
  const expected = await hmacHex(
    env.DROPBOX_SIGN_API_KEY!,
    `${event.event_time}${event.event_type}`,
  );
  if (!timingSafeEqual(expected, event.event_hash)) {
    return json({ ok: false, error: "Invalid signature." }, 401, cors);
  }

  const providerRequestId = event.signature_request?.signature_request_id;
  const nextStatus = DROPBOX_STATUS[event.event_type];
  if (!providerRequestId || !nextStatus) {
    // Acknowledge unhandled but authentic events so the provider stops retrying.
    return json({ ok: true, ignored: true }, 200, cors);
  }

  const tokenHash = await env.CONTRACTS!.get(`request:${providerRequestId}`);
  if (!tokenHash) {
    return json({ ok: true, ignored: true }, 200, cors);
  }

  const key = `contract:${tokenHash}`;
  const current = (await env.CONTRACTS!.get(key, "json")) as ContractRecord | null;
  if (!current) {
    return json({ ok: true, ignored: true }, 200, cors);
  }

  // Never regress a terminal state (e.g. signed back to viewed).
  if (current.status === "signed" || current.status === "declined") {
    return json({ ok: true, ignored: true }, 200, cors);
  }

  const updated: ContractRecord = {
    ...current,
    status: nextStatus,
    updatedAt: new Date().toISOString(),
  };
  await env.CONTRACTS!.put(key, JSON.stringify(updated), {
    expirationTtl: Math.max(
      60,
      Math.floor((new Date(current.expiresAt).getTime() - Date.now()) / 1000) +
        7 * 86_400,
    ),
  });

  return json({ ok: true }, 200, cors);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const cors = corsHeaders(request, env);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    if (url.pathname === "/healthz") {
      return json({
        ok: true,
        email: Boolean(env.RESEND_API_KEY && env.FROM_EMAIL && env.INQUIRY_TO_EMAIL),
        contracts: contractConfigured(env),
      });
    }

    if (request.method !== "POST") {
      return json({ ok: false, error: "Method not allowed." }, 405, {
        ...cors,
        allow: "POST, OPTIONS",
      });
    }

    if (!isAllowedOrigin(request, env)) {
      return json({ ok: false, error: "Origin not allowed." }, 403, cors);
    }

    switch (url.pathname) {
      case "/api/inquiries":
        return handleInquiry(request, env, cors);
      case "/api/contracts/status":
        return handleContractStatus(request, env, cors);
      case "/api/contracts/register":
        return handleContractRegister(request, env, cors);
      case "/api/webhooks/dropbox-sign":
        return handleWebhook(request, env, cors);
      default:
        return json({ ok: false, error: "Not found." }, 404, cors);
    }
  },
};
