export const getApiUrl = (
  apiUrl: string,
  endpoint: string,
  params: Record<string, any> = {},
) => {
  const cleanApiUrl = apiUrl.replace(/\/$/, "");
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  let fullUrl = `${cleanApiUrl}${cleanEndpoint}`;

  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams();

    Object.keys(params).forEach((key) => {
      if (
        params[key] !== undefined &&
        params[key] !== null &&
        params[key] !== ""
      ) {
        searchParams.set(key, String(params[key]));
      }
    });

    const queryString = searchParams.toString();
    if (queryString) {
      // If the URL already has a ? (e.g. ?rest_route=...), append with &
      fullUrl += fullUrl.includes("?") ? `&${queryString}` : `?${queryString}`;
    }
  }

  return fullUrl;
};
