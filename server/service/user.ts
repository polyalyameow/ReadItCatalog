import { eq, and } from "drizzle-orm";
import { db } from "../config/db";
import { userBooks, books, users, userBookFeedback, jwtBlacklist } from "../db/schema";
import bcrypt from 'bcryptjs';
import { generateJWT } from "../utils/jwtUtils";
import { v4 as uuidv4 } from 'uuid';
import { BookFeedback, UserLogin, UserRegistration } from "../../shared/types/types";

export const getUserSavedBooks = async (userId: string) => {
  
  const result = await db.select({
    user_book_id: userBooks.id,
    isbn: books.isbn,
    title: books.title,
    year: books.year,
    page_count: books.page_count,
    language: books.language,
    genre: books.genre,
    author: books.author,
    image_url: books.image_url,
    tags: books.tags,
    rating: userBookFeedback.rating,
    comment: userBookFeedback.comment,
    year_of_reading: userBookFeedback.year_of_reading,
    month_of_reading: userBookFeedback.month_of_reading,
  })
    .from(userBooks)
    .innerJoin(books, eq(userBooks.isbn, books.isbn))
    .innerJoin(userBookFeedback, eq(userBooks.id, userBookFeedback.user_book_id))
    .where(eq(userBooks.user_id, userId))
    .execute();

  console.log('[RESULT OF ADDING BOOK]', result)
  return result;
};

export const patchBookFeedbackByUserBookId = async (userBookId: number, data: Partial<BookFeedback>) => {
  await db.update(userBookFeedback)
    .set(data)
    .where(eq(userBookFeedback.user_book_id, userBookId))
    .execute();
};

export const deleteUserBook = async (userId: string, userBookId: number): Promise<boolean> => {

  const result = await db.transaction(async (tx) => {
    const userBook = await tx.select()
      .from(userBooks)
      .where(and(eq(userBooks.user_id, userId), eq(userBooks.id, userBookId)))
      .limit(1)
      .execute();

    if (!userBook || userBook.length === 0) {
      return false;
    }

    await tx
      .delete(userBookFeedback)
      .where(eq(userBookFeedback.user_book_id, userBookId))
      .execute();

    await tx
      .delete(userBooks)
      .where(and(eq(userBooks.user_id, userId), eq(userBooks.id, userBookId)))
      .execute();

    return true;
  })
  return result;
};

export const registerUser = async (
  { email,
    username,
    password,
    confirm_password: confirmPassword }: UserRegistration
): Promise<{ token: string; user: { id: string; email: string; username: string } }> => {
  if (password !== confirmPassword) {
    throw new Error('Passwords do not match');
  }

  const result = await db.transaction(async (tx) => {


    const existingUser = await tx.select().from(users).where(eq(users.email, email)).execute();

    if (existingUser.length > 0) {
      throw new Error('Email already in use');
    }

    const userId = uuidv4();

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    await tx.insert(users).values({
      id: userId,
      email,
      username,
      password: hashedPassword,
    });

    const token = generateJWT(userId);

    return {
      token,
      user: {
        id: userId,
        email,
        username,
      }
    };
  })
  return result;
};


export const loginUser = async ({ email, password }: UserLogin) => {
  const result = await db.transaction(async (tx) => {
    const user = await tx.select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
      .execute();

    if (!user.length) {
      throw new Error("Invalid email or password");
    }

    const foundUser = user[0];

    const isPasswordValid = await bcrypt.compareSync(password, foundUser.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const token = generateJWT(foundUser.id);

    return {
      token,
      user: {
        id: foundUser.id,
        email: foundUser.email,
        username: foundUser.username,
      },
    };
  })
  return result;
};

export const logoutUser = async (token: string) => {
  await db.transaction(async (tx) => {
    await tx.insert(jwtBlacklist).values({
      token,
      created_at: Date.now(),
    });
  })
};
