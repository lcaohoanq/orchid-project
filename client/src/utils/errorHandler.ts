import toast from "react-hot-toast";

// Global error handler for API errors
interface ApiErrorResponse {
  data?: {
    message?: string;
    [key: string]: any;
  };
  status?: number;
  [key: string]: any;
}

interface ApiError {
  response?: ApiErrorResponse;
  request?: any;
  message?: string;
  [key: string]: any;
}

export const handleApiError = (
  error: ApiError,
  customMessage?: string,
): string => {
  console.error("API Error:", error);

  let errorMessage: string = customMessage || "Something went wrong";

  if (error.response) {
    // Server responded with error status
    errorMessage =
      error.response.data?.message || `Server Error: ${error.response.status}`;
  } else if (error.request) {
    // Network error - no response received
    errorMessage =
      "Cannot connect to server. Please check if the backend is running on http://localhost:8080";
  } else {
    // Other error
    errorMessage = error.message || "An unexpected error occurred";
  }

  toast.error(errorMessage, {
    duration: 5000,
    position: "top-center",
  });
  return errorMessage;
};

// Check if API server is available
interface ApiInstance {
  get: (url: string) => Promise<any>;
}

export const checkApiConnection = async (
  apiInstance: ApiInstance,
): Promise<boolean> => {
  try {
    await apiInstance.get("/health-check");
    return true;
  } catch (error) {
    console.error("API Server is not available:", error);
    toast.error(
      "Cannot connect to server. Please check if the backend is running on http://localhost:8080",
    );
    return false;
  }
};

export default { handleApiError, checkApiConnection };
