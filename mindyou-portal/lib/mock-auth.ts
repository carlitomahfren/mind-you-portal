// ⚠️ DEMO ONLY — this entire file simulates a backend that does not exist yet.
// When real endpoints land, delete this file and replace each call site's
// `getDemoError` usage with the actual API response handling. Search the
// codebase for "// DEMO ONLY" to find every call site.

export type DemoErrorCode =
  | "invalid_credentials"
  | "account_exists"
  | "account_not_found"
  | "server_error";

export interface DemoRequest {
  email?: string;
  password?: string;
}

export const MOCK_LATENCY_MS = 600;

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// DEMO ONLY trigger map:
//   Login           → password "wrong"                  = invalid credentials
//   Register        → email starting with "taken"       = account already exists
//   Forgot password → email starting with "offline"     = server error
//   Activate        → email starting with "notfound"    = no account found
export function getDemoError({
  email,
  password,
}: DemoRequest): DemoErrorCode | null {
  const normalizedEmail = (email ?? "").trim().toLowerCase();
  if ((password ?? "").trim().toLowerCase() === "wrong") {
    return "invalid_credentials";
  }
  if (normalizedEmail.startsWith("taken")) return "account_exists";
  if (normalizedEmail.startsWith("offline")) return "server_error";
  if (normalizedEmail.startsWith("notfound")) return "account_not_found";
  return null;
}
