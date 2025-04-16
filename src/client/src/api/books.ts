import { z } from "zod";
import axiosInstance from "./axiosInstance";

export const getBooks = async () => {
  try {
    const response = await axiosInstance.get("/books");
    return response.data;
  } catch (error: unknown) {
          if (error instanceof z.ZodError) {
              throw new Error(error.message);
          } else {
              throw new Error("Failed to add book.")
          }
    }
};

