import { mysqlTable, varchar, int, json, primaryKey, foreignKey } from "drizzle-orm/mysql-core";

const defaultImage = './img/default_book.jpg'

export const books = mysqlTable("books", {
  isbn: varchar("isbn", { length: 13 }).primaryKey().notNull(),
  title: varchar("title", { length: 255 }),
  year: int("year"),
  pageCount: int("page_count"),
  language: varchar("language", { length: 10 }),
  genre: varchar("genre", { length: 100 }),
  author: varchar("author", { length: 255 }),
  imageUrl: varchar("image_url", { length: 500 }).default(defaultImage),
  tags: json("tags").$type<string[]>(),
});

export const userBookFeedback = mysqlTable("user_book_feedback", {
  id: int("id").primaryKey().autoincrement(),
  userBookId: int("user_book_id").notNull().references(() => userBooks.id),
  rating: int("rating"),
  comment: varchar("comment", { length: 1000 }),
  yearOfReading: int("year_of_reading"),
  monthOfReading: varchar("month_of_reading", { length: 20 }),
});

export const userBooks = mysqlTable("user_books", {
  id: int("id").primaryKey().autoincrement(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id),
  isbn: varchar("isbn", { length: 13 }).references(() => books.isbn),
  addedAt: int("added_at").notNull(),
})

  
export const users = mysqlTable("users", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  username: varchar("username", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
});

export const jwtBlacklist = mysqlTable("jwt_blacklist", {
  token: varchar("token", { length: 500 }).primaryKey(),
  createdAt: int("created_at").notNull(),
});