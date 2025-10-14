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
    if (error?.response?.statusCode === 401) {
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
      error.response?.data?.data?.message ||
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
      responseData.data.message || "Something went wrong, Please try again!"
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

const get433aSectionInfo = (caseId: string, section: Form433aSection) =>
  apiHandler<{ data: any; message: string }>(() =>
    API.get(`/form433a/${caseId}/section?section=${section}`)
  );

const savePersonalInfo = (info: any, caseId: string) =>
  apiHandler<{ data: any; message: string }>(() =>
    API.post(`/form433a/${caseId}/personal-info`, info)
  );

const saveEmploymentInfo = (info: any, caseId: string) =>
  apiHandler<{ data: any; message: string }>(() =>
    API.post(`/form433a/${caseId}/employment`, info)
  );

const savePersonalAssetsInfo = (info: any, caseId: string) =>
  apiHandler<{ data: any; message: string }>(() =>
    API.post(`/form433a/${caseId}/assets`, info)
  );

const saveSelfEmployedInfo = (info: any, caseId: string) =>
  apiHandler<{ data: any; message: string }>(() =>
    API.post(`/form433a/${caseId}/self-employed-info`, info)
  );

const saveBusinessAssetsInfo = (info: any, caseId: string) =>
  apiHandler<{ data: any; message: string }>(() =>
    API.post(`/form433a/${caseId}/business`, info)
  );

const api = {
  savePersonalInfo,
  saveEmploymentInfo,
  get433aSectionInfo,
  savePersonalAssetsInfo,
  saveSelfEmployedInfo,
  saveBusinessAssetsInfo,
};

export default api;
