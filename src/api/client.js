const DEFAULT_BASE_URL = "/api/backend";

function withParams(path, params) {
  if (!params) return path;
  const query = new URLSearchParams(params);
  const suffix = query.toString();
  return suffix ? `${path}${path.includes("?") ? "&" : "?"}${suffix}` : path;
}

async function request(method, path, payload, options = {}) {
  const { baseURL = DEFAULT_BASE_URL, params, headers = {}, ...fetchOptions } = options;
  const url = `${baseURL.replace(/\/$/, "")}/${withParams(path.replace(/^\//, ""), params)}`;
  const isFormData = typeof FormData !== "undefined" && payload instanceof FormData;

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      method,
      credentials: "same-origin",
      headers: {
        ...(!isFormData && payload !== undefined ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      body: payload === undefined ? undefined : isFormData ? payload : JSON.stringify(payload),
    });
    let data;
    try {
      data = await response.json();
    } catch {
      data = { success: response.ok, message: response.ok ? "Request successful" : "Unexpected server response" };
    }
    return { data, status: response.status, headers: response.headers };
  } catch {
    return {
      data: { success: false, message: "Unable to reach the server. Please try again." },
      status: 0,
      headers: new Headers(),
    };
  }
}

const api = {
  get: (path, options) => request("GET", path, undefined, options),
  post: (path, payload, options) => request("POST", path, payload, options),
  put: (path, payload, options) => request("PUT", path, payload, options),
  patch: (path, payload, options) => request("PATCH", path, payload, options),
  delete: (path, options) => request("DELETE", path, undefined, options),
};

export default api;
