export const getApiUrl = (apiUrl: string, endpoint: string, params: Record<any, any> = {}) => {
  const url = new URL(`${apiUrl}${endpoint}`);
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.set(key, params[key]);
    }
  });
  return url.toString();
};
