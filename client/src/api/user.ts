import { z } from "zod";
import axiosInstance from "./axiosInstance";
import { UserAndBookRow } from "../../../shared/types/types";

export const getUserBooks = async () => {
  try {
    const response = await axiosInstance.get("/user/my-books");
    return response.data;
  } catch (error: unknown) {
          if (error instanceof z.ZodError) {
              throw new Error(error.message);
          } else {
              throw new Error("Failed to load my-books page.")
          }
    }
};

export const deleteUserBook = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/user/my-books/${id}`)
    return response.data;
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
        throw new Error(error.message);
    } else {
        throw new Error("Failed to delete this book.")
    }
}
};

export const patchUserBook = async (id: string, data: Partial<UserAndBookRow>) => {
  try {
    const response = await axiosInstance.patch(`/user/my-books/${id}/feedback`, data)
    return response.data;
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
        throw new Error(error.message);
    } else {
        throw new Error("Failed to make changes this book.")
    }
}
}