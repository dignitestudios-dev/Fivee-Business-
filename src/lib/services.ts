import { isBrowser, storage } from "@/utils/helper";
import axios from "axios";

export const BASE_URL = "https://api.fiveebusiness.com/";
// export const BASE_URL = "http://localhost:3001/";

// Create an Axios instance
const API = axios.create({
  baseURL: BASE_URL,
  timeout: 1000000, // Set a timeout (optional)
  headers: {
    "Content-Type": "application/json",
  },
});

// Define routes that do not require authentication
const publicEndpoints = [
  "/user/signin",
  "/user/signup",
  "/user/verify-email",
  "/user/forgot-password",
  "/user/reset-password",
];

// Request Interceptor
API.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = storage.get("accessToken");

      // Check if current request URL matches a public endpoint
      const isPublic = publicEndpoints.some((endpoint) =>
        config.url?.includes(endpoint)
      );

      // Attach token only for non-public endpoints
      if (!isPublic) {
        if (token) {
          config.headers.authorization = `Bearer ${token}`;
        } else {
          return Promise.reject("Session expired. Please log in again.");
        }
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
    const requestUrl = error?.config?.url || "";
    const isPublic = publicEndpoints.some((endpoint) =>
      requestUrl.includes(endpoint)
    );

    // Only handle token removal & redirect for non-public endpoints
    if (!isPublic && error?.response?.status === 401) {
      storage.remove("accessToken");
      storage.remove("user");
      window.location.href = "/auth/login";
    }

    console.log("Complete Error:", error);
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
    console.log("API Error:", errorMessage);
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
    console.log("responseData: ", responseData);
    throw new Error(
      responseData.data.message || "Something went wrong, Please try again!"
    );
  }

  return responseData; // Only return the response data {status, message, data}
};

export const apiHandler = async <T>(apiCall: () => Promise<T>): Promise<T> => {
  try {
    const response = await apiCall();
    return handleApiResponse(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Centralized API Handling functions end

// Auth API's

const login = (payload: LoginPayload) =>
  apiHandler(() => API.post("/user/signin", payload));

const signup = (payload: SignupPayload) =>
  apiHandler(() => API.post("/user/signup", payload));

const verifyEmail = (token: string) =>
  apiHandler(() => API.post("/user/verify-email", { token }));

const forgotPassword = (payload: ForgotPasswordPayload) =>
  apiHandler(() => API.post("/user/forgot-password", payload));

const resetPassword = (payload: ResetPasswordPayload) =>
  apiHandler(() => API.post("/user/reset-password", payload));

// Form 433A OIC

const getUserForm433ACases = (
  page: number = 1,
  limit: number = defaultLimit,
  filter: FormsCasesFilter = "all"
) =>
  apiHandler(() =>
    API.get(`/form433a/my-cases?page=${page}&limit=${limit}&filter${filter}`)
  );

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

const saveBusinessIncomeInfo = (info: any, caseId: string) =>
  apiHandler<{ data: any; message: string }>(() =>
    API.post(`/form433a/${caseId}/business-income-expense`, info)
  );

const saveHouseholdIncomeInfo = (info: any, caseId: string) =>
  apiHandler<{ data: any; message: string }>(() =>
    API.post(`/form433a/${caseId}/household-income-expense`, info)
  );

const saveCalculationInfo = (info: any, caseId: string) =>
  apiHandler<{ data: any; message: string }>(() =>
    API.post(`/form433a/${caseId}/offer-calculation`, info)
  );

const saveOtherInfo = (info: any, caseId: string) =>
  apiHandler<{ data: any; message: string }>(() =>
    API.post(`/form433a/${caseId}/other-information`, info)
  );

const saveSignatureInfo = (info: any, caseId: string) =>
  apiHandler<{ data: any; message: string }>(() =>
    API.post(`/form433a/${caseId}/signatures-and-attachments`, info)
  );

// Signature APIs

const getSignatures = () =>
  apiHandler<{ data: { images: any[] }; message: string }>(() =>
    API.get(`/media/image`)
  );

const createSignature = (data: FormData) =>
  apiHandler<{ data: any; message: string }>(() =>
    API.post(`/media/image`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  );

const updateSignature = (id: string, data: FormData) =>
  apiHandler<{ data: any; message: string }>(() =>
    API.patch(`/media/image/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  );

const deleteSignature = (id: string) =>
  apiHandler<{ data: any; message: string }>(() =>
    API.delete(`/media/image/${id}`)
  );

// Video APIs
const getVideoCategories = () =>
  apiHandler<{ data: { categories: string[] }; message: string }>(() =>
    API.get(`/media/video/categories`)
  );

const getVideos = (
  page: number = 1,
  limit: number = defaultLimit,
  category?: string
) =>
  apiHandler<{
    data: {
      video: any[];
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    message: string;
  }>(() =>
    // Use axios params so serialization is handled correctly (avoids manual url-encoding issues)
    API.get(`/media/video`, {
      params: category ? { page, limit, category } : { page, limit },
    })
  );

// Form 433B OIC

const getUserForm433BCases = (
  page: number = 1,
  limit: number = defaultLimit,
  filter: FormsCasesFilter = "all"
) =>
  apiHandler(() =>
    API.get(
      `/form433boic/my-cases?page=${page}&limit=${limit}&filter=${filter}`
    )
  );

// Start Form APIs
const startForm433a = (payload: { title: string }) =>
  apiHandler<{ data: { caseId: string }; message: string }>(() =>
    API.post(`/form433a/start`, payload)
  );

const startForm433b = (payload: { title: string }) =>
  apiHandler<{ data: { caseId: string }; message: string }>(() =>
    API.post(`/form433boic/start`, payload)
  );

// Manage saved preferences - update / delete
const updateForm433a = (caseId: string, payload: { title?: string }) =>
  apiHandler(() => API.patch(`/form433a/${caseId}`, payload));

const deleteForm433a = (caseId: string) =>
  apiHandler(() => API.delete(`/form433a/${caseId}`));

const updateForm433b = (caseId: string, payload: { title?: string }) =>
  apiHandler(() => API.patch(`/form433boic/${caseId}`, payload));

const deleteForm433b = (caseId: string) =>
  apiHandler(() => API.delete(`/form433boic/${caseId}`));

const get433bSectionInfo = (caseId: string, section: Form433bSection) =>
  apiHandler<{ data: any; message: string }>(() =>
    API.get(`/form433boic/${caseId}/section?section=${section}`)
  );

const saveBusinessInfo = (info: any, caseId: string) =>
  apiHandler<{ data: any; message: string }>(() =>
    API.post(`/form433boic/${caseId}/business-information`, info)
  );

const saveBusinessAssetInfo = (info: any, caseId: string) =>
  apiHandler(() =>
    API.post(`/form433boic/${caseId}/business-asset-info`, info)
  );

const saveBusinessIncomeInfoFormB = (info: any, caseId: string) =>
  apiHandler(() =>
    API.post(`/form433boic/${caseId}/business-income-info`, info)
  );

const saveBusinessExpenseInfoFormB = (info: any, caseId: string) =>
  apiHandler(() =>
    API.post(`/form433boic/${caseId}/business-expense-info`, info)
  );

const saveCalculationInfoFormB = (info: any, caseId: string) =>
  apiHandler(() =>
    API.post(`/form433boic/${caseId}/calculate-minimum-offer-amount`, info)
  );

const saveOtherInfoFormB = (info: any, caseId: string) =>
  apiHandler(() => API.post(`/form433boic/${caseId}/other-information`, info));

const saveSignaturesAndAttachmentsFormB = (info: any, caseId: string) =>
  apiHandler(() => API.post(`/form433boic/${caseId}/signatures`, info));

// Form 656

const get656SectionInfo = (caseId: string, section: string) =>
  apiHandler<{ data: any; message: string }>(() =>
    API.get(`/form656b/${caseId}/section?section=${section}`)
  );

const saveIndividualInfo = (info: any, caseId: string) =>
  apiHandler<{ data: any; message: string }>(() =>
    API.post(`/form656b/${caseId}/individual-info`, info)
  );

const saveReasonForOffer = (info: any, caseId: string) =>
  apiHandler<{ data: any; message: string }>(() =>
    API.post(`/form656b/${caseId}/reason-for-offer`, info)
  );

const saveBusinessInfo656 = (info: any, caseId: string) =>
  apiHandler<{ data: any; message: string }>(() =>
    API.post(`/form656b/${caseId}/business-info`, info)
  );

const savePaymentTerms = (info: any, caseId: string) =>
  apiHandler<{ data: any; message: string }>(() =>
    API.post(`/form656b/${caseId}/payment-terms`, info)
  );

const saveDesignationEftps = (info: any, caseId: string) =>
  apiHandler<{ data: any; message: string }>(() =>
    API.post(`/form656b/${caseId}/designation-and-eftps`, info)
  );

const saveSourceOfFunds = (info: any, caseId: string) =>
  apiHandler<{ data: any; message: string }>(() =>
    API.post(`/form656b/${caseId}/source-of-funds-requirements`, info)
  );

const saveSignatures = (info: any, caseId: string) =>
  apiHandler<{ data: any; message: string }>(() =>
    API.post(`/form656b/${caseId}/signatures`, info)
  );

const savePaidPreparer = (info: any, caseId: string) =>
  apiHandler<{ data: any; message: string }>(() =>
    API.post(`/form656b/${caseId}/paid-preparer-use-only`, info)
  );

const saveApplicationChecklist = (info: any, caseId: string) =>
  apiHandler<{ data: any; message: string }>(() =>
    API.post(`/form656b/${caseId}/application-checklist`, info)
  );

// Form 656 - list user's cases
const getUserForm656Cases = (page: number = 1, limit: number = defaultLimit) =>
  apiHandler(() => API.get(`/form656b/my-cases?page=${page}&limit=${limit}`));

const generate656Pdf = (caseId: string) =>
  apiHandler<{ data: { url: string }; message: string }>(() =>
    API.get(`/form656b/${caseId}/generate-pdf`)
  );

// Start Form 656
const startForm656 = (payload: {
  form433AId?: string;
  form433BOICId?: string;
  usedPreQualifierOrIOLACheck: boolean;
  title: string;
}) => apiHandler(() => API.post(`/form656b/start`, payload));

// Payment Method API's

const addPaymentMethod = (payload: AddCardPayload) =>
  apiHandler(() => API.post(`/payment/add-card`, payload));

const deletePaymentMethod = (paymentMethodId: string) =>
  apiHandler(() => API.delete(`/payment/delete-card/${paymentMethodId}`));

const getAllPaymentMethods = () =>
  apiHandler(() => API.get(`/payment/list-cards`));

// Create a payment intent for a pre-saved payment method
const createPaymentIntent = (payload: {
  paymentMethodId: string;
  amount: number;
  formId: string;
  formModel: string;
}) => apiHandler(() => API.post(`/payment/create-intent`, payload));

const api = {
  savePersonalInfo,
  saveEmploymentInfo,
  get433aSectionInfo,
  savePersonalAssetsInfo,
  saveSelfEmployedInfo,
  saveBusinessAssetsInfo,
  saveBusinessIncomeInfo,
  saveHouseholdIncomeInfo,
  saveCalculationInfo,
  saveOtherInfo,
  saveSignatureInfo,
  getSignatures,
  createSignature,
  updateSignature,
  deleteSignature,
  getVideoCategories,
  getVideos,
  updateForm433a,
  deleteForm433a,
  updateForm433b,
  deleteForm433b,
  login,
  signup,
  verifyEmail,
  forgotPassword,
  resetPassword,
  get433bSectionInfo,
  saveBusinessInfo,
  saveBusinessAssetInfo,
  saveBusinessIncomeInfoFormB,
  saveBusinessExpenseInfoFormB,
  saveCalculationInfoFormB,
  saveOtherInfoFormB,
  saveSignaturesAndAttachmentsFormB,
  addPaymentMethod,
  deletePaymentMethod,
  getAllPaymentMethods,
  createPaymentIntent,
  getUserForm433ACases,
  getUserForm433BCases,
  getUserForm656Cases,
  startForm656,
  startForm433a,
  startForm433b,
  get656SectionInfo,
  saveIndividualInfo,
  saveReasonForOffer,
  saveBusinessInfo656,
  savePaymentTerms,
  saveDesignationEftps,
  saveSourceOfFunds,
  saveSignatures,
  savePaidPreparer,
  saveApplicationChecklist,
  generate656Pdf,
};

export default api;
