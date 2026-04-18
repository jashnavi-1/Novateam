import axios from "axios";

export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8081/api";

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
});

export const getApiErrorMessage = (
  error,
  fallback = "Request failed. Please try again."
) => {
  if (error?.code === "ECONNABORTED") {
    return `Request timed out. Backend may be slow or unavailable at ${API_BASE_URL}.`;
  }

  if (error?.code === "ERR_NETWORK") {
    return `Cannot connect to backend at ${API_BASE_URL}. Make sure backend is running and CORS is enabled.`;
  }

  const responseData = error?.response?.data;

  if (typeof responseData === "string" && responseData.trim()) {
    return responseData;
  }

  if (
    responseData &&
    typeof responseData === "object" &&
    typeof responseData.message === "string"
  ) {
    return responseData.message;
  }

  if (typeof error?.message === "string" && error.message.trim()) {
    return error.message;
  }

  return fallback;
};

export default API;
