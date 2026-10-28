import { site } from "@/config/site";
import type { InquirySubmission } from "@/lib/validation";

export type InquiryKind = "contact" | "project";

export type ApiErrorCode =
  | "not_configured"
  | "network"
  | "timeout"
  | "validation"
  | "rate_limited"
  | "server"
  | "unknown";

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status?: number;

  constructor(code: ApiErrorCode, message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

export interface InquiryReceipt {
  id: string;
}

const REQUEST_TIMEOUT_MS = 20_000;

async function postJson(
  url: string,
  body: unknown,
  signal?: AbortSignal,
): Promise<{ response: Response; data: unknown }> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const abortFromCaller = () => controller.abort();
  signal?.addEventListener("abort", abortFromCaller);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      credentials: "omit",
      mode: "cors",
      signal: controller.signal,
    });

    const contentType = response.headers.get("content-type") ?? "";
    const data: unknown = contentType.includes("application/json")
      ? await response.json().catch(() => null)
      : null;

    return { response, data };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError(
        "timeout",
        "The request took too long. Please try again in a moment.",
      );
    }
    throw new ApiError(
      "network",
      "We could not reach the form service. Check your connection and try again.",
    );
  } finally {
    window.clearTimeout(timeout);
    signal?.removeEventListener("abort", abortFromCaller);
  }
}

function readMessage(data: unknown, fallback: string): string {
  if (data && typeof data === "object" && "error" in data) {
    const error = (data as { error?: unknown }).error;
    if (typeof error === "string" && error.length < 400) return error;
  }
  return fallback;
}

/**
 * Submits an inquiry to the configured serverless endpoint. Success is only
 * reported when the backend explicitly confirms it — never optimistically.
 */
export async function submitInquiry(
  payload: InquirySubmission,
  signal?: AbortSignal,
): Promise<InquiryReceipt> {
  const endpoint = site.endpoints.inquiry;
  if (!endpoint) {
    throw new ApiError(
      "not_configured",
      "The inquiry service is not connected yet. Add VITE_INQUIRY_ENDPOINT to the build environment and deploy the server in /server.",
    );
  }

  const { response, data } = await postJson(
    `${endpoint}/api/inquiries`,
    payload,
    signal,
  );

  if (response.status === 429) {
    throw new ApiError(
      "rate_limited",
      readMessage(data, "Too many requests. Please wait a few minutes and try again."),
      429,
    );
  }

  if (response.status === 422) {
    throw new ApiError(
      "validation",
      readMessage(data, "Some details need attention. Please review the form."),
      422,
    );
  }

  if (response.status === 503) {
    throw new ApiError(
      "not_configured",
      readMessage(
        data,
        "The form service is deployed but not configured to send email yet.",
      ),
      503,
    );
  }

  if (!response.ok) {
    throw new ApiError(
      "server",
      readMessage(data, "Something went wrong on our side. Please email us directly."),
      response.status,
    );
  }

  const receipt =
    data && typeof data === "object" && "id" in data
      ? (data as { id?: unknown }).id
      : undefined;

  if (typeof receipt !== "string" || receipt.length === 0) {
    throw new ApiError(
      "unknown",
      "The form service returned an unexpected response. Please email us directly.",
    );
  }

  return { id: receipt };
}

export type ContractStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "signed"
  | "declined"
  | "expired";

export interface ContractStatusResult {
  status: ContractStatus;
  updatedAt: string;
  provider: string;
}

/**
 * Looks up a contract's status through the backend. The access token is a
 * bearer capability; no document contents are returned by this endpoint.
 */
export async function fetchContractStatus(
  token: string,
): Promise<ContractStatusResult> {
  const endpoint = site.endpoints.contractApi;
  if (!endpoint) {
    throw new ApiError(
      "not_configured",
      "Contract status lookups are not connected yet. The server in /server must be deployed and VITE_CONTRACT_API_ENDPOINT configured.",
    );
  }

  const { response, data } = await postJson(
    `${endpoint}/api/contracts/status`,
    { token },
  );

  if (response.status === 404) {
    throw new ApiError(
      "validation",
      "That link is not recognised. Check the token in your signing email, or contact us.",
      404,
    );
  }
  if (response.status === 410) {
    throw new ApiError(
      "validation",
      "This contract link has expired. Contact us and we will issue a new one.",
      410,
    );
  }
  if (response.status === 429) {
    throw new ApiError(
      "rate_limited",
      "Too many lookups. Please wait a few minutes and try again.",
      429,
    );
  }
  if (!response.ok) {
    throw new ApiError(
      "server",
      readMessage(data, "We could not retrieve the contract status right now."),
      response.status,
    );
  }

  const statuses: ContractStatus[] = [
    "draft",
    "sent",
    "viewed",
    "signed",
    "declined",
    "expired",
  ];
  const payload = data as Partial<ContractStatusResult> | null;
  if (
    !payload ||
    typeof payload.status !== "string" ||
    !statuses.includes(payload.status as ContractStatus)
  ) {
    throw new ApiError(
      "unknown",
      "The contract service returned an unexpected response.",
    );
  }

  return {
    status: payload.status as ContractStatus,
    updatedAt: payload.updatedAt ?? "",
    provider: payload.provider ?? "signature provider",
  };
}
