import axios from "axios";
import type { LoginRes } from "../types";

// Define interfaces for API requests and responses
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  code: number;
  message: string;
  data: null;
}

const API_BASE_URL = "http://localhost:8080/api/v1"; // Replace with your actual API URL

// Login API function
export const loginApi = async (
  email: string,
  password: string,
): Promise<LoginRes> => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, {
    email,
    password,
  });

  if (response.status !== 200) {
    throw new Error("Login failed");
  }

  return response.data;
};

// Register API function
export const registerApi = async (
  name: string,
  email: string,
  password: string,
): Promise<RegisterResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    throw new Error("Registration failed");
  }

  return response.json();
};
