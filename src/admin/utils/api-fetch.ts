/**
 * A wrapper around the native fetch API that automatically injects the WordPress CSRF nonce
 * when calling the plugin's REST API endpoints.
 *
 * @param input The URL or Request object
 * @param init The fetch options
 * @returns Promise<Response>
 */
export async function apiFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const url = input instanceof Request ? input.url : input.toString();
  const connector = (window as any).catcher24Connector;

  if (
    connector?.apiUrl &&
    connector?.nonce &&
    url.startsWith(connector.apiUrl)
  ) {
    const newInit = { ...init };
    const headers = new Headers(
      newInit.headers || (input instanceof Request ? input.headers : {}),
    );

    headers.set("X-WP-Nonce", connector.nonce);
    newInit.headers = headers;

    return window.fetch(input, newInit);
  }

  return window.fetch(input, init);
}
