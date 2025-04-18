import { z } from "zod";
import axiosInstance from "./axiosInstance";

export const getBooks = async (isbn: string) => {
  try {
    const response = await axiosInstance.get(`/books/${isbn}`);
    return response.data;
  } catch (error: unknown) {
          if (error instanceof z.ZodError) {
              throw new Error(error.message);
          } else {
              throw new Error("Failed to find this book. Please double check ISBN")
          }
    }
};

