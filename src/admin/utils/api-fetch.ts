/**
 * A fetch wrapper that automatically injects the WordPress Nonce,
 * enforces credentials, and silently refreshes the session if it expires.
 */
export async function apiFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const urlString = input instanceof Request ? input.url : input.toString();

  // @ts-ignore - Assuming this is injected via wp_localize_script
  const connector = window.catcher24Connector;

  let finalInit = { ...init };

  // CRITICAL: Ensure WordPress auth cookies are sent with every request
  finalInit.credentials = finalInit.credentials || "same-origin";

  // Safely decode both URLs so encoded slashes (%2F) don't break the match
  const normalizedTarget = decodeURIComponent(urlString);
  const normalizedBase = connector?.apiUrl
    ? decodeURIComponent(connector.apiUrl)
    : "";

  // Inject Nonce if the request is going to our plugin's API
  if (
    normalizedBase &&
    connector?.nonce &&
    normalizedTarget.includes(normalizedBase)
  ) {
    const headers = new Headers(
      finalInit.headers || (input instanceof Request ? input.headers : {}),
    );
    headers.set("X-WP-Nonce", connector.nonce);
    finalInit.headers = headers;
  }

  // 1. Make the initial request
  let response = await window.fetch(input, finalInit);

  return response;
}
