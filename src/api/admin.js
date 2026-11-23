import api from "@/api/client.js";

export const adminRequest = (path, options = {}) => {
  const method = (options.method ?? "GET").toLowerCase();
  const request = method === "get" || method === "delete"
    ? api[method](`/${path.replace(/^\//, "")}`, options)
    : api[method](`/${path.replace(/^\//, "")}`, options.body, options);
  return request.then((response) => response.data);
};
