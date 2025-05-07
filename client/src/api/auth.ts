import api from "./axiosInstance";
import { UserRegistration, UserLogin } from "../../../shared/types/types";
import { z } from "zod";

export const registerUser = async (data: UserRegistration) => {
  try {
    const response = await api.post("/auth/register", data);
    return response.data;
  } catch (error: unknown) {
        if (error instanceof z.ZodError) {
            throw new Error(error.message);
        } else {
            throw new Error("Registreringen misslyckades")
        }
  }
};


export const loginUser = async (data: UserLogin) => {
  try {
    const response = await api.post("/auth/login", data);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
        throw new Error(error.message);
    } else {
        throw new Error("Fel email eller lösenord")
    }
}
};

export const logoutUser = async (token: string) => {
  try {
    const response = await api.post("/auth/logout", { token });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
        throw new Error(error.message);
    } else {
        throw new Error("Utloggning misslyckades")
    }
}
};


export const isAuthenticated = async () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const response = await api.get("/auth/verify");
    return response.status === 200;
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
        throw new Error(error.message);
    } else {
        return false
    }
}
};