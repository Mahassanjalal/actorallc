// @vitest-environment node
/// <reference types="node" />
import { createHash, createHmac } from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";
import worker, { type Env } from "../../server/src/index";

interface MockKV {
  store: Map<string, string>;
  get(key: string, type?: "json"): Promise<unknown>;
  put(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
}

function mockKV(): MockKV {
  const store = new Map<string, string>();
  return {
    store,
    async get(key: string, type?: "json") {
      const value = store.get(key) ?? null;
      if (value === null) return null;
      return type === "json" ? JSON.parse(value) : value;
    },
    async put(key: string, value: string) {
      store.set(key, value);
    },
    async delete(key: string) {
      store.delete(key);
    },
  };
}

const ORIGIN = "https://actorallc.example";
const API = "https://api.actorallc.example";

function env(overrides: Partial<Env> = {}): Env {
  return {
    RESEND_API_KEY: "re_test",
    FROM_EMAIL: "Actora <hello@example.com>",
    INQUIRY_TO_EMAIL: "company@example.com",
    ALLOWED_ORIGINS: ORIGIN,
    AUTO_REPLY: "false",
    RATE_LIMIT: mockKV() as unknown as Env["RATE_LIMIT"],
    CONTRACTS: mockKV() as unknown as Env["CONTRACTS"],
    ...overrides,
  };
}

function inquiryRequest(
  body: Record<string, unknown>,
  options: { origin?: string | null; ip?: string } = {},
) {
  const headers: Record<string, string> = {
    "content-type": "application/json",
    "CF-Connecting-IP": options.ip ?? "203.0.113.7",
  };
  const origin = options.origin === undefined ? ORIGIN : options.origin;
  if (origin) headers.origin = origin;
  return new Request(`${API}/api/inquiries`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

function validInquiry(overrides: Record<string, unknown> = {}) {
  return {
    kind: "project",
    name: "Grace Hopper",
    email: "grace@example.com",
    company: "Northlight",
    phone: "",
    projectType: "Website or platform",
    budget: "$40,000 – $80,000",
    timeline: "Within 3–4 months",
    message: "We need a new marketing site and a product design system.",
    consent: true,
    website: "",
    elapsedMs: 5000,
    page: "/start-a-project",
    ...overrides,
  };
}

describe("inquiry endpoint", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it("refuses to report success when email is not configured", async () => {
    const response = await worker.fetch(
      inquiryRequest(validInquiry()),
      env({ RESEND_API_KEY: undefined }),
    );
    expect(response.status).toBe(503);
    const body = await response.json();
    expect(body.ok).toBe(false);
  });

  it("rejects requests from unapproved origins", async () => {
    const response = await worker.fetch(
      inquiryRequest(validInquiry(), { origin: "https://attacker.example" }),
      env(),
    );
    expect(response.status).toBe(403);
  });

  it("validates payloads on the server", async () => {
    const response = await worker.fetch(
      inquiryRequest(
        validInquiry({ email: "nope", projectType: "Not real", consent: false }),
      ),
      env(),
    );
    expect(response.status).toBe(422);
    const body = (await response.json()) as {
      ok: boolean;
      errors: Record<string, string>;
    };
    expect(body.ok).toBe(false);
    expect(body.errors.email).toBeTruthy();
    expect(body.errors.projectType).toBeTruthy();
    expect(body.errors.consent).toBeTruthy();
  });

  it("silently discards honeypot submissions", async () => {
    const resend = vi.fn();
    vi.stubGlobal("fetch", resend);
    const response = await worker.fetch(
      inquiryRequest(validInquiry({ website: "https://spam.example" })),
      env(),
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, id: "discarded" });
    expect(resend).not.toHaveBeenCalled();
  });

  it("sends the notification and returns a reference on success", async () => {
    const resend = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ id: "email_1" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", resend);
    const response = await worker.fetch(inquiryRequest(validInquiry()), env());
    expect(response.status).toBe(200);
    const body = (await response.json()) as { ok: boolean; id: string };
    expect(body.ok).toBe(true);
    expect(body.id).toMatch(/^ACT-/);
    expect(resend).toHaveBeenCalledTimes(1);
    const [, init] = resend.mock.calls[0];
    expect(JSON.parse(String(init.body)).to).toEqual(["company@example.com"]);
  });

  it("returns a failure (never success) when the provider rejects the email", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("nope", { status: 500 })),
    );
    const response = await worker.fetch(inquiryRequest(validInquiry()), env());
    expect(response.status).toBe(502);
    const body = (await response.json()) as { ok: boolean };
    expect(body.ok).toBe(false);
  });

  it("rate limits repeated submissions from one address", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("{}", { status: 200 })),
    );
    const sharedEnv = env();
    let lastStatus = 0;
    for (let attempt = 0; attempt < 7; attempt += 1) {
      const response = await worker.fetch(
        inquiryRequest(validInquiry(), { ip: "198.51.100.4" }),
        sharedEnv,
      );
      lastStatus = response.status;
    }
    expect(lastStatus).toBe(429);
  });
});

describe("contract webhook", () => {
  const API_KEY = "test_sign_api_key";
  const token = "a".repeat(64);
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const requestId = "req_123456";

  async function configuredEnv() {
    const contracts = mockKV();
    await contracts.put(`request:${requestId}`, tokenHash);
    await contracts.put(
      `contract:${tokenHash}`,
      JSON.stringify({
        providerRequestId: requestId,
        status: "sent",
        updatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 86_400_000).toISOString(),
      }),
    );
    return { env: env({ DROPBOX_SIGN_API_KEY: API_KEY, CONTRACTS: contracts as unknown as Env["CONTRACTS"] }), contracts };
  }

  function webhookRequest(overrides: Record<string, string> = {}) {
    const eventTime = "1760000000";
    const eventType = "signature_request_all_signed";
    const hash = createHmac("sha256", API_KEY)
      .update(`${eventTime}${eventType}`)
      .digest("hex");
    return new Request(`${API}/api/webhooks/dropbox-sign`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        event: {
          event_time: eventTime,
          event_type: eventType,
          event_hash: hash,
          signature_request: { signature_request_id: requestId },
          ...overrides,
        },
      }),
    });
  }

  it("rejects an event with an invalid signature", async () => {
    const { env: configured } = await configuredEnv();
    const bad = webhookRequest({ event_hash: "0".repeat(64) });
    const response = await worker.fetch(bad, configured);
    expect(response.status).toBe(401);
  });

  it("records a signed status only for a verified event", async () => {
    const { env: configured, contracts } = await configuredEnv();
    const response = await worker.fetch(webhookRequest(), configured);
    expect(response.status).toBe(200);
    const stored = JSON.parse(contracts.store.get(`contract:${tokenHash}`)!);
    expect(stored.status).toBe("signed");
  });

  it("returns contract status for a valid access token without exposing the document", async () => {
    const { env: configured } = await configuredEnv();
    const response = await worker.fetch(
      new Request(`${API}/api/contracts/status`, {
        method: "POST",
        headers: { "content-type": "application/json", origin: ORIGIN },
        body: JSON.stringify({ token }),
      }),
      configured,
    );
    expect(response.status).toBe(200);
    const body = (await response.json()) as Record<string, unknown>;
    expect(body.status).toBe("sent");
    expect(body).not.toHaveProperty("providerRequestId");
    expect(body).not.toHaveProperty("clientEmailHash");
  });

  it("rejects tokens that do not exist", async () => {
    const { env: configured } = await configuredEnv();
    const response = await worker.fetch(
      new Request(`${API}/api/contracts/status`, {
        method: "POST",
        headers: { "content-type": "application/json", origin: ORIGIN },
        body: JSON.stringify({ token: "b".repeat(64) }),
      }),
      configured,
    );
    expect(response.status).toBe(404);
  });
});
