import { mysqlTable, varchar, int, json } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { createId } from '@paralleldrive/cuid2';

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
