import axios from "axios";

const DEFAULT_API_BASE_URL = "https://event-budaya.iccn.or.id/api";

const resolvedBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL;

const api = axios.create({
  baseURL: resolvedBaseUrl,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const maybeMessage =
        (typeof error.response?.data === "object" &&
          error.response?.data !== null &&
          "message" in error.response.data &&
          typeof error.response.data.message === "string" &&
          error.response.data.message) ||
        error.message;

      if (maybeMessage) {
        error.message = maybeMessage;
      }
    }

    return Promise.reject(error);
  }
);

export default api;