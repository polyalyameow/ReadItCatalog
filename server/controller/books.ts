import { Request, Response } from "express";
import { fetchBookInfoByISBN } from "../service/books.js";
import { AuthRequest } from "../middleware/verifyJwt.js";

export const getBookInfoByISBNController = async (
  req: AuthRequest<{ isbn: string }>,
  res: Response
) => {
  const { isbn } = req.params;
  const userId = req.currentUser?.id;

  if (!userId) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  try {
    const bookInfo = await fetchBookInfoByISBN(isbn, userId);
    if (!bookInfo) {
      return res.status(404).json({ error: "Book not found" });
    }
    return res.json(bookInfo);
  } catch (error: any) {
    console.error("Error fetching book info:", error);
    return res.status(500).json({ error: error.message ?? "Error fetching book information" });
  }
};
