import { Request, Response } from "express";
import { fetchBookInfoByISBN } from "../service/books.js";

export const getBookInfoByISBNController = async (
  req: Request<{ isbn: string }>,
  res: Response
) => {
  const { isbn } = req.params;

  try {
    const bookInfo = await fetchBookInfoByISBN(isbn);
    if (!bookInfo) {
      return res.status(404).json({ error: "Book not found" });
    }
    return res.json(bookInfo);
  } catch (error: any) {
    console.error("❌ Error fetching book info:", error); // ✅ Log full error
    return res.status(500).json({ error: error.message ?? "Error fetching book information" });
  }
};
