import { Response } from "express";
import { fetchBookInfoByISBN, fetchBookMetadataOnly } from "../service/books.js";
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

  let aborted = false;

  req.on("aborted", () => {
    aborted = true;
  });

  try {
    const metadata = await fetchBookMetadataOnly(isbn);
    if (aborted) {
      console.error("Aborted request, skipping response and DB save");
      return;
    }
    const bookInfo = await fetchBookInfoByISBN(metadata, userId);
    if (!bookInfo) {
      return res.status(404).json({ error: "Book not found" });
    }
    return res.json(bookInfo);
  } catch (error: unknown) {
    if (!(error instanceof Error)) {
      return;
    }
    console.error("Error fetching book info:", error);
    return res.status(500).json({ error: error.message ?? "Error fetching book information" });
  }
};
