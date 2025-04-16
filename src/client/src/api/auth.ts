import axiosInstance from "./axiosInstance";
import { UserRegistration, UserLogin } from "../../../types/types";
import { z } from "zod";

export const registerUser = async (data: UserRegistration) => {
  try {
    const response = await axiosInstance.post("/auth/register", data);
    return response.data;
  } catch (error: unknown) {
        if (error instanceof z.ZodError) {
            throw new Error(error.message);
        } else {
            throw new Error("Registration failed")
        }
  }
};


export const loginUser = async (data: UserLogin) => {
  try {
    const response = await axiosInstance.post("/auth/login", data);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
        throw new Error(error.message);
    } else {
        throw new Error("Wrong email or password")
    }
}
};

export const logoutUser = async (token: string) => {
  try {
    const response = await axiosInstance.post("/auth/logout", { token });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
        throw new Error(error.message);
    } else {
        throw new Error("Logout failed")
    }
}
};


export const isAuthenticated = async () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const response = await axiosInstance.get("/auth/verify");
    return response.status === 200;
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
        throw new Error(error.message);
    } else {
        return false
    }
}
};