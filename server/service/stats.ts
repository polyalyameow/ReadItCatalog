import { BookInfo, BookRow } from "../../shared/types/types";
import { db } from "../config/db";
import { books, userBookFeedback, userBooks } from "../db/schema";
import { eq, and, not, or } from "drizzle-orm";

type TimeScope = { year?: number; month?: string };

export const getBookStatsForPolarChart = async ({ year, month }: TimeScope) => {
  let feedbacks = [];

  if (year) {
    feedbacks = await db
      .select()
      .from(userBookFeedback)
      .where(eq(userBookFeedback.year_of_reading, year))
      .execute();
  } else if (month) {
    feedbacks = await db
      .select()
      .from(userBookFeedback)
      .where(eq(userBookFeedback.month_of_reading, month))
      .execute();
  } else {
    feedbacks = await db.select().from(userBookFeedback).execute();
  }

  let filteredBooks = [];
  if (year || month) {
    const userBookIds = feedbacks.map(f => f.user_book_id);
    
    let booksJoined: any[] = [];
    if (userBookIds.length > 0) {
      booksJoined = await db
        .select()
        .from(userBooks)
        .innerJoin(books, eq(userBooks.isbn, books.isbn))
        .where(or(...userBookIds.map(id => eq(userBooks.id, id))))
        .execute();
    }

    filteredBooks = booksJoined
      .map(b => b.books)
      .filter(book => book.genre !== "unknown" && book.language !== "unknown");
  } else {
    const allBooks = await db
      .select()
      .from(books)
      .where(and(
        not(eq(books.genre, "unknown")),
        not(eq(books.language, "unknown"))
      ))
      .execute();
    filteredBooks = allBooks;
  }

  if (filteredBooks.length === 0) {
    return {
      labels: ["No Data Available"],
      data: [0]
    };
  }

  const totalBooks = filteredBooks.length;
  const totalPages = filteredBooks.reduce((sum, b) => sum + (b.page_count || 0), 0);

  const genreMap: Record<string, number> = {};
  const languageMap: Record<string, number> = {};
  const ratingMap: Record<string, number> = {};

  filteredBooks.forEach(book => {
    if (book.genre) genreMap[book.genre] = (genreMap[book.genre] || 0) + 1;
    if (book.language) languageMap[book.language] = (languageMap[book.language] || 0) + 1;
  });

  feedbacks.forEach(fb => {
    const label = fb.rating?.toString() || "Unrated";
    ratingMap[label] = (ratingMap[label] || 0) + 1;
  });

  return {
    labels: [
      ...Object.keys(genreMap).map(g => `Genre: ${g}`),
      ...Object.keys(languageMap).map(l => `Language: ${l}`),
      ...Object.keys(ratingMap).map(r => `Rating: ${r}`),
      "Total Books",
      "Total Pages"
    ],
    data: [
      ...Object.values(genreMap),
      ...Object.values(languageMap),
      ...Object.values(ratingMap),
      totalBooks,
      totalPages
    ]
  };
};
