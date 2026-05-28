let silentRefreshPromise: Promise<boolean> | null = null;

/**
 * Initiates a silent token refresh via a hidden iframe.
 * Communicates with Keycloak (with prompt=none) and updates window.catcher24Connector on success.
 */
export function performSilentRefresh(): Promise<boolean> {
  if (silentRefreshPromise) {
    return silentRefreshPromise;
  }

  silentRefreshPromise = (async () => {
    try {
      const connector = window.catcher24Connector;
      if (!connector) {
        return false;
      }

      // 1. Fetch the silent sign-in redirect URL
      const signinRes = await window.fetch(`${connector.apiUrl}/accounts/signin?silent=1`, {
        headers: {
          "X-WP-Nonce": connector.nonce || "",
        },
      });

      if (!signinRes.ok) {
        return false;
      }

      const { redirect_url } = await signinRes.json();
      if (!redirect_url) {
        return false;
      }

      // 2. Load the URL inside a hidden iframe to perform the auth flow
      return new Promise<boolean>((resolve) => {
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.src = redirect_url;

        let resolved = false;

        const cleanup = () => {
          window.removeEventListener("message", handleMessage);
          if (iframe.parentNode) {
            iframe.parentNode.removeChild(iframe);
          }
          clearTimeout(timeoutId);
        };

        const handleMessage = async (event: MessageEvent) => {
          if (resolved) return;
          if (event.data && typeof event.data === "object") {
            if (event.data.type === "CATCHER24_AUTH_SUCCESS") {
              resolved = true;
              cleanup();

              // Fetch the newly updated configuration/token data from the backend
              try {
                const infoRes = await window.fetch(`${connector.apiUrl}/accounts/info`, {
                  headers: {
                    "X-WP-Nonce": connector.nonce || "",
                  },
                });
                if (infoRes.ok) {
                  const freshData = await infoRes.json();
                  Object.assign(window.catcher24Connector, freshData);
                }
              } catch (e) {
                console.error("Failed to retrieve updated connector info", e);
              }

              resolve(true);
            } else if (event.data.type === "CATCHER24_AUTH_FAILURE") {
              resolved = true;
              cleanup();
              resolve(false);
            }
          }
        };

        // Enforce a 20 second timeout
        const timeoutId = setTimeout(() => {
          if (!resolved) {
            resolved = true;
            cleanup();
            resolve(false);
          }
        }, 20000);

        window.addEventListener("message", handleMessage);
        document.body.appendChild(iframe);
      });
    } catch (error) {
      console.error("Silent refresh error", error);
      return false;
    } finally {
      silentRefreshPromise = null;
    }
  })();

  return silentRefreshPromise;
}

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

  // 2. Handle unauthorized response with silent background refresh
  if (response.status === 401) {
    const success = await performSilentRefresh();
    if (success) {
      // Re-inject updated Nonce if applicable
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
      // Retry the original request
      response = await window.fetch(input, finalInit);
    } else {
      // Silent refresh failed (SSO expired), clear local session details and force login
      if (window.catcher24Connector) {
        window.catcher24Connector.userInfo = null;
      }
      window.location.hash = "/login";
    }
  }

  return response;
}
