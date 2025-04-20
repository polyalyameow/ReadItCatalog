import { z } from "zod";
import axiosInstance from "./axiosInstance";

export const getGeneralStats = async () => {
    try {
      const response = await axiosInstance.get('/stats/general');
      return response.data;
    } catch (error: unknown) {
            if (error instanceof z.ZodError) {
                throw new Error(error.message);
            } else {
                throw new Error("Failed to find general stats for your books. Please double check ISBN")
            }
      }
  };


export const getMonthlyStats = async () => {
    try {
        const response = await axiosInstance.get('/stats/monthly');
        return response.data;
    } catch (error: unknown) {
        if (error instanceof z.ZodError) {
            throw new Error(error.message);
        } else {
            throw new Error("Failed to find monthly stats for your books. Please double check ISBN")
        }
    }
};



export const getYearlyStats = async () => {
    try {
        const response = await axiosInstance.get('/stats/yearly');
        return response.data;
    } catch (error: unknown) {
        if (error instanceof z.ZodError) {
            throw new Error(error.message);
        } else {
            throw new Error("Failed to find yearly stats for your books. Please double check ISBN")
        }
    }
};