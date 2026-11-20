import { AxiosError } from "axios";
import { matchRoute, HttpError } from "./handlers";

const latency = () => new Promise((r) => setTimeout(r, 350 + Math.random() * 450));

/**
 * Axios adapter that answers requests from the simulated backend.
 * Responses mimic a real REST API (status codes, { message, data } bodies).
 */
export async function mockAdapter(config) {
  await latency();
  const method = (config.method || "get").toUpperCase();
  const url = new URL(config.url, "http://mock.local");
  const query = { ...Object.fromEntries(url.searchParams), ...(config.params || {}) };
  const body = typeof config.data === "string" ? JSON.parse(config.data || "{}") : config.data || {};

  const respond = (status, data) => ({ data, status, statusText: String(status), headers: {}, config, request: {} });

  const route = matchRoute(method, url.pathname);
  try {
    if (!route) throw new HttpError(404, `No demo endpoint for ${method} ${url.pathname}`);
    const data = route.handler({ body, query, params: route.params, headers: config.headers });
    return respond(200, data);
  } catch (err) {
    const status = err instanceof HttpError ? err.status : 500;
    const response = respond(status, { message: err.message || "Unexpected error" });
    throw new AxiosError(err.message, status >= 500 ? "ERR_BAD_RESPONSE" : "ERR_BAD_REQUEST", config, {}, response);
  }
}
