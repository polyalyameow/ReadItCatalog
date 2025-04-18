import { getBookStatsForPolarChart } from "../service/stats";
import { Request, Response } from "express";

export const getPolarChartStatsController = async (req: Request, res: Response): Promise<Response> => {
    const { year, month } = req.query;

    if (year && isNaN(Number(year))) {
        return res.status(400).json({ error: 'Invalid year provided.' });
      }
    
      if (month && !["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].includes(String(month))) {
        return res.status(400).json({ error: 'Invalid month provided.' });
      }
    
      try {
        const stats = await getBookStatsForPolarChart({ year: Number(year), month: String(month) });
        return res.json(stats);
      } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch book stats.' });
      }
  };