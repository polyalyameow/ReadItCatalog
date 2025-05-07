import { z } from "zod";
import axiosInstance from "./axiosInstance";

export const getBooks = async (isbn: string, signal?: AbortSignal) => {
  try {
    const response = await axiosInstance.get(`/books/${isbn}`, { signal });
    return response.data;
  } catch (error: unknown) {
          if (error instanceof z.ZodError) {
              throw new Error(error.message);
          } else {
              throw new Error("Kunde inte hitta boken. Kontrollera ISBN och försök igen.")
          }
    }
};

