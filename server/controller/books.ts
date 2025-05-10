import { Response } from "express";
import { fetchBookInfoByISBN, fetchBookMetadataOnly } from "../service/books.js";
import { AuthRequest } from "../middleware/verifyJwt.js";
import logger from "../utils/logger";

export const getBookInfoByISBNController = async (
  req: AuthRequest<{ isbn: string }>,
  res: Response
) => {
  const { isbn } = req.params;
  const userId = req.currentUser?.id;

  if (!userId) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  const controller = new AbortController();

  req.on("aborted", () => {
    controller.abort();
    logger.warn("Client aborted request — aborting upstream fetches.");
  });

  try {
    const metadata = await fetchBookMetadataOnly(isbn, controller.signal);
    if (controller.signal.aborted) {
      logger.error("Aborted request, skipping response and DB save");
      return;
    }

    const bookInfo = await fetchBookInfoByISBN(metadata, userId, controller.signal);
    if (!bookInfo) {
      return res.status(404).json({ error: "Book not found" });
    }
    return res.json(bookInfo);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (!(error instanceof Error)) {
      return;
    }
    logger.error("Error fetching book info:", error);
    return res.status(500).json({ error: error.message ?? "Error fetching book information" });
  }
};
