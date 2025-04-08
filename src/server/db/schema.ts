import { mysqlTable, varchar, int, json, primaryKey } from "drizzle-orm/mysql-core";

const defaultImage = './img/default_book.jpg'

export const books = mysqlTable("books", {
    isbn: varchar("isbn", { length: 13 }).primaryKey(),
    title: varchar("title", { length: 255 }),
    year: int("year"),
    pageCount: int("page_count"),
    language: varchar("language", { length: 10 }),
    genre: varchar("genre", { length: 100 }),
    author: varchar("author", { length: 255 }),
    imageUrl: varchar("image_url", { length: 500 }).default(defaultImage),
    tags: json("tags").$type<string[]>(),
});

export const userBooks = mysqlTable("user_books", {
    userId: varchar("user_id", { length: 256 }).notNull(),
    isbn: varchar("isbn", { length: 13 }).notNull(),
    addedAt: int("added_at").notNull(),
  }, (table) => [
    primaryKey({columns: [table.userId, table.isbn]})
  ]);
  
export const users = mysqlTable("users", {
    id: varchar("id", { length: 255 }).notNull().primaryKey(),
    username: varchar("username", { length: 255 }).notNull(),
    hash: varchar("hash", { length: 255 }).notNull(),
    salt: varchar("salt", { length: 255 }).notNull(),
  });
