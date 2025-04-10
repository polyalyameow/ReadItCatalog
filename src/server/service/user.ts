import { eq } from "drizzle-orm";
import { db } from "../config/db";
import { userBooks, books, users, userBookFeedback } from "../db/schema";
import bcrypt from 'bcryptjs';
import { generateJWT } from "../utils/jwtUtils";
import { v4 as uuidv4 } from 'uuid';
import { UserLogin, UserRegistration } from "../../types/types";

export const getUserSavedBooks = async (userId: string) => {
    const savedBooks = await db
      .select({
        isbn: books.isbn,
        title: books.title,
        year: books.year,
        pageCount: books.pageCount,
        language: books.language,
        genre: books.genre,
        author: books.author,
        imageUrl: books.imageUrl,
        tags: books.tags,
        rating: userBookFeedback.rating,
        comment: userBookFeedback.comment,
        yearOfReading: userBookFeedback.yearOfReading,
        monthOfReading: userBookFeedback.monthOfReading,
      })
      .from(userBooks)
      .innerJoin(books, eq(userBooks.isbn, books.isbn))
      .innerJoin(userBookFeedback, eq(userBooks.id, userBookFeedback.userBookId))
      .where(eq(userBooks.userId, userId))
      .execute();
  
    return savedBooks;
  };

export const registerUser = async (
 { email,
  username,
  password,
  confirmPassword}: UserRegistration
) => {
  if (password !== confirmPassword) {
    throw new Error('Passwords do not match');
  }

  const existingUser = await db.select().from(users).where(eq(users.email, email)).execute();

  if (existingUser.length > 0) {
    throw new Error('Email already in use');
  }

  const userId = uuidv4();

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  await db.insert(users).values({
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
};


export const loginUser = async ({ email, password }: UserLogin) => {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1)
    .execute();

  if (!user.length) {
    throw new Error("Invalid email or password");
  }

  const foundUser = user[0];

  const isPasswordValid = bcrypt.compareSync(password, foundUser.password);
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
};
