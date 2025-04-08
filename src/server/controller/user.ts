import { Request, Response } from "express";
import { getUserSavedBooks } from "../service/user";

// @TODO: change userId after jwt implementation
export const getUserSavedBooksController = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId as string; // Get userId from the authenticated user
    const savedBooks = await getUserSavedBooks(userId);
    res.status(200).json(savedBooks); // Send the saved books as JSON
  } catch (error) {
    res.status(500).json({ message: "Error fetching user saved books", error });
  }
};
