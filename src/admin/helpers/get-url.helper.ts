export const getUrl = (path: string, params = {}) => {
  const query = new URLSearchParams(params).toString();
  return `${catcher24Connector.apiUrl}${path}${query ? `?${query}` : ""}`;
};
