import { isBrowser, storage } from "@/utils/helper";
import axios from "axios";

// Create an Axios instance
const API = axios.create({
  baseURL: "http://18.117.169.39/",
  timeout: 10000, // Set a timeout (optional)
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
API.interceptors.request.use(
  (config) => {
    if (isBrowser) {
      const token = storage.get("accessToken"); // Retrieve token from storage

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
    console.log("Code: ", error?.response);

    if (error?.response?.data?.statusCode === 401) {
      storage.remove("accessToken");
      storage.remove("user");
      // window.location.href = "/auth/login";
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

const apiHandler = async <T>(apiCall: () => Promise<T>): Promise<T> => {
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

// Form 433A OIC

const getUserForm433ACases = () =>
  apiHandler(() => API.get("/form433a/my-cases"));

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

// Form 433B OIC

const getUserForm433BCases = () =>
  apiHandler(() => API.get("/form433boic/my-cases"));

// Start Form APIs
const startForm433a = (payload: { title: string }) =>
  apiHandler<{ data: { caseId: string }; message: string }>(() =>
    API.post(`/form433a/start`, payload)
  );

const startForm433b = (payload: { title: string }) =>
  apiHandler<{ data: { caseId: string }; message: string }>(() =>
    API.post(`/form433boic/start`, payload)
  );

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
  login,
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
  startForm433a,
  startForm433b,
};

export default api;
