/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";
import axiosInstance from "./axiosInstance";

export const getGeneralStats = async () => {
    try {
        const response = await axiosInstance.get('/stats/general');
        return response.data;
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            throw new Error(error.message);
        } else {
            throw new Error("Kunde inte hitta statistik för dina böcker.")
        }
    }
};


export const getMonthlyStats = async () => {
    try {
        const response = await axiosInstance.get('/stats/monthly');
        return response.data;
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            throw new Error(error.message);
        } else {
            throw new Error("Kunde inte hitta månadsstatistik för dina böcker.")
        }
    }
};



export const getYearlyStats = async () => {
    try {
        const response = await axiosInstance.get('/stats/yearly');
        return response.data;
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            throw new Error(error.message);
        } else {
            throw new Error("Kunde inte hitta årsstatistik för dina böcker.")
        }
    }
};