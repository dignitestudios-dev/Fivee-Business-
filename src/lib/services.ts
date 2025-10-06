import { isBrowser } from "@/utils/helper";
import axios from "axios";

// Create an Axios instance
const API = axios.create({
  baseURL: "http://localhost:3001/",
  timeout: 10000, // Set a timeout (optional)
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
API.interceptors.request.use(
  (config) => {
    if (isBrowser) {
      const token = localStorage.getItem("accessToken"); // Retrieve token from storage

      if (token) {
        config.headers.authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("accessToken");
      window.location.href = "/auth/login";
    }
    console.log(error);
    console.log("API Error:", error.response?.data || error);
    return Promise.reject(error);
  }
);

// default limit
const defaultLimit = 20;

// Centralized API Handling functions start
const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";
    console.error("API Error:", errorMessage);
    throw new Error(errorMessage);
  }
  throw new Error(
    (error as any).message || error || "An Unexpected error occurred"
  );
};

const handleApiResponse = (response: any) => {
  const responseData = response.data;

  // Check if status is false and throw an error
  if (!responseData.status) {
    throw new Error(
      responseData.message || "Something went wrong, Please try again!"
    );
  }

  return responseData; // Only return the response data {status, message, data}
};

const apiHandler = async <T>(apiCall: () => Promise<T>): Promise<T> => {
  try {
    const response = await apiCall();
    return handleApiResponse(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Centralized API Handling functions end

const staticCaseId = "68e37684434f542dca06fda3";

const savePersonalInfo = (info: any) =>
  apiHandler<{ data: any; message: string }>(() =>
    API.post(`/form433a/${staticCaseId}/personal-info`, info)
  );

const saveEmploymentInfo = (info: any) =>
  apiHandler<{ data: any; message: string }>(() =>
    API.post(`/form433a/${staticCaseId}/employment`, info)
  );

const api = {
  savePersonalInfo,
  saveEmploymentInfo
};

export default api;
