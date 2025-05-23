import { Response } from "express";
import { AuthRequest } from "../middleware/verifyJwt";
import { getGeneralStats, getMontlyStats, getYearlyStats } from "../service/stats";

export const getGeneralStatsController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.currentUser?.id as string;
    const generalStats = await getGeneralStats(userId);
    res.status(200).json(generalStats);
  } catch (error) {
    res.status(500).json({ message: "Error getting general stats", error });
  }
};

export const getMontlyStatsController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.currentUser?.id as string;
    const montlyStats = await getMontlyStats(userId);
    res.status(200).json(montlyStats);
  } catch (error) {
    res.status(500).json({ message: "Error getting monthly stats", error });
  }
}

export const getYearlyStatsController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.currentUser?.id as string;
    const yearlyStats = await getYearlyStats(userId);
    res.status(200).json(yearlyStats);
  } catch (error) {
    res.status(500).json({ message: "Error getting monthly stats", error });
  }
}