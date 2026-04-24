/**
 * A wrapper around the native fetch API that automatically injects the WordPress CSRF nonce
 * when calling the plugin's REST API endpoints.
 *
 * @param input The URL or Request object
 * @param init The fetch options
 * @returns Promise<Response>
 */
export async function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  let url = '';
  if (typeof input === 'string') {
    url = input;
  } else if (input instanceof URL) {
    url = input.toString();
  } else if (input instanceof Request) {
    url = input.url;
  }

  // @ts-ignore
  const connector = window.catcher24WordpressConnector;

  if (connector && connector.apiUrl && url.startsWith(connector.apiUrl)) {
    const newInit = init || {};
    newInit.headers = {
      ...newInit.headers,
      'X-WP-Nonce': connector.nonce
    };
    return window.fetch(input, newInit);
  }

  return window.fetch(input, init);
}
