const getUrl = (path: string, params = {}) => {
  const query = new URLSearchParams(params).toString();
  return `${catcher24WordpressConnector.apiUrl}${path}${query ? `?${query}` : ""}`;
};
