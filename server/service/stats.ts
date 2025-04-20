import { getUserSavedBooks } from "./user";
import logger from "../logger";

export const getGeneralStats = async (userId: string) => {
  const allBooks = await getUserSavedBooks(userId);
  if (!allBooks) {
    logger.error("No books found")
    return;
  }
  const totalBooks = allBooks.length;
  const totalPages = allBooks.reduce((sum, book) => {
    return sum + (book.page_count ?? 0);
  }, 0);
  const totalLanguages: Record<string, number> = {}
  allBooks.forEach((book) => {
    if (book.language) {
      if (totalLanguages[book.language]) {
        totalLanguages[book.language] += 1;
      } else {
        totalLanguages[book.language] = 1;
      }
    }
  });

  const totalRating: Record<string, number> = {}
  allBooks.forEach((book) => {
    if (book.rating) {
      if (totalRating[book.rating]) {
        totalRating[book.rating] += 1;
      } else {
        totalRating[book.rating] = 1;
      }
    }
  });

  return {
    totalBooks: totalBooks,
    totalPages: totalPages,
    totalLanguages: totalLanguages,
    totalRating: totalRating
  }
}


export const getMontlyStats = async (userId: string) => {
  const allBooks = await getUserSavedBooks(userId);
  if (!allBooks) {
    logger.error("No books found")
    return;
  }

  const currentYear = new Date().getFullYear();
  const currentYearBooks = allBooks.filter(book => book.year_of_reading === currentYear);

  const monthlyRegister: Record<string, typeof allBooks> = {}

  currentYearBooks.forEach((book) => {
    if (book.month_of_reading) {
      if (monthlyRegister[book.month_of_reading]) {
        monthlyRegister[book.month_of_reading].push(book);
      } else {
        monthlyRegister[book.month_of_reading] = [book];
      }
    }
  });


  const monthStats: Record<string, {
    totalBooks: number;
    totalPages: number;
    totalLanguages: Record<string, number>;
    totalRating: Record<string, number>;
  }> = {};

  for (const [month, books] of Object.entries(monthlyRegister)) {
    const totalBooks = books.length;
    const totalPages = books.reduce((sum, book) => sum + (book.page_count ?? 0), 0);

    const totalLanguages: Record<string, number> = {};
    books.forEach((book) => {
      if (book.language) {
        if (totalLanguages[book.language]) {
          totalLanguages[book.language] += 1;
        } else {
          totalLanguages[book.language] = 1;
        }
      }
    });

    const totalRating: Record<string, number> = {};
    books.forEach((book) => {
      if (book.rating) {
        if (totalRating[book.rating]) {
          totalRating[book.rating] += 1;
        } else {
          totalRating[book.rating] = 1;
        }
      }
    });

    monthStats[month] = {
      totalBooks,
      totalPages,
      totalLanguages,
      totalRating,
    };
  }

  const monthOrder = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const orderedStats: typeof monthStats = {};
  monthOrder.forEach((month) => {
    if (monthStats[month]) {
      orderedStats[month] = monthStats[month];
    }
  });

  return orderedStats;

}

export const getYearlyStats = async (userId: string) => {
  const allBooks = await getUserSavedBooks(userId);
  if (!allBooks) {
    logger.error("No books found")
    return;
  }

  const yearlyRegister: Record<string, typeof allBooks> = {}

  allBooks.forEach((book) => {
    if (book.year_of_reading) {
      if (yearlyRegister[book.year_of_reading]) {
        yearlyRegister[book.year_of_reading].push(book);
      } else {
        yearlyRegister[book.year_of_reading] = [book];
      }
    }
  });

  const yearStats: Record<string, {
    totalBooks: number;
    totalPages: number;
    totalLanguages: Record<string, number>;
    totalRating: Record<string, number>;
  }> = {};

  for (const [year, books] of Object.entries(yearlyRegister)) {
    const totalBooks = books.length;
    const totalPages = books.reduce((sum, book) => sum + (book.page_count ?? 0), 0);

    const totalLanguages: Record<string, number> = {};
    books.forEach((book) => {
      if (book.language) {
        if (totalLanguages[book.language]) {
          totalLanguages[book.language] += 1;
        } else {
          totalLanguages[book.language] = 1;
        }
      }
    });

    const totalRating: Record<string, number> = {};
    books.forEach((book) => {
      if (book.rating) {
        if (totalRating[book.rating]) {
          totalRating[book.rating] += 1;
        } else {
          totalRating[book.rating] = 1;
        }
      }
    });

    yearStats[year] =
    {
      totalBooks,
      totalPages,
      totalLanguages,
      totalRating
    }
  }
  return yearStats;
}