import axios from "axios";

const createApiInstance = (baseURL: string) => {
  const instance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    timeout: 10000,
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      // Example: attach token if needed
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error(
        `[API Error - ${baseURL}]`,
        error?.response || error.message,
      );
      return Promise.reject(error);
    },
  );

  return instance;
};

export const isDev = process.env.NODE_ENV === "development";
export const devUrl = "http://localhost:8080/api";
export const prodUrl = "https://orchid.lch.id.vn/api";
export const baseUrl = isDev ? devUrl : prodUrl;

// Instances
export const orchidApi = createApiInstance(baseUrl);
