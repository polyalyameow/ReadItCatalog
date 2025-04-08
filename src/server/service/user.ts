import { eq } from "drizzle-orm";
import { db } from "../config/db";
import { userBooks, books } from "../db/schema";

export const getUserSavedBooks = async (userId: string) => {
    const savedBooks = await db
      .select()
      .from(userBooks)
      .innerJoin(books, eq(userBooks.isbn, books.isbn))
      .where(eq(userBooks.userId, userId))
      .execute();
  
    return savedBooks;
  };
  