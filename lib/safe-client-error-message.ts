/**
 * Maps unknown errors to safe, generic user-facing strings.
 * Never surfaces raw API, Supabase, or server messages in the UI.
 */
export function safeClientErrorToastMessage(error: unknown): string {
  if (isLikelyNetworkError(error)) {
    return "Network error. Please try again.";
  }
  return "Application error. Please try again.";
}

function isLikelyNetworkError(error: unknown): boolean {
  if (typeof TypeError !== "undefined" && error instanceof TypeError) {
    const m = error.message.toLowerCase();
    if (
      m.includes("fetch") ||
      m.includes("network") ||
      m.includes("failed to fetch") ||
      m.includes("load failed")
    ) {
      return true;
    }
  }
  if (error instanceof Error) {
    const m = error.message.toLowerCase();
    if (error.name === "NetworkError") return true;
    if (m.includes("networkerror")) return true;
    if (m.includes("failed to fetch")) return true;
    if (m.includes("network request failed")) return true;
  }
  return false;
}
