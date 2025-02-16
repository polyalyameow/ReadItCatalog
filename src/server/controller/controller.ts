import express, { Request, Response } from "express";
import { fetchBookInfoByISBN } from "../service/service.js";

export const getBookInfoByISBN = async (
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
  } catch (error) {
    return res.status(500).json({ error: "Error fetching book information" });
  }
};
