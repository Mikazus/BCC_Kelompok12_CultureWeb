import axios from "axios";

export const getApiErrorMessage = (error: unknown, fallback = "Terjadi kesalahan.") => {
  if (axios.isAxiosError(error)) {
    if (
      typeof error.response?.data === "object" &&
      error.response?.data !== null &&
      "message" in error.response.data &&
      typeof error.response.data.message === "string"
    ) {
      return error.response.data.message;
    }

    return error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  return fallback;
};
