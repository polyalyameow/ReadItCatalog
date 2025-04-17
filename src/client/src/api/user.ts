import { z } from "zod";
import axiosInstance from "./axiosInstance";

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