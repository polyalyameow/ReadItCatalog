import { z } from "zod";
import axiosInstance from "./axiosInstance";

export const getUsersBooks = async () => {
  try {
    const response = await axiosInstance.get("/my-books");
    return response.data;
  } catch (error: unknown) {
          if (error instanceof z.ZodError) {
              throw new Error(error.message);
          } else {
              throw new Error("Failed to load my-books page.")
          }
    }
};