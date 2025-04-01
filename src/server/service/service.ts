import axios from "axios";
import { BookInfo, BookInfoSchema } from "../types";
import pool from "../db/db";
import mysql from "mysql2/promise";

interface LibrisBookResponse {
  hasTitle?: { mainTitle: string }[];
  publication?: { year: number | string }[];
  extent?: { label: string[] | string }[];
  instanceOf?: {
    language?: { code: string }[];
    genreForm?: { prefLabelByLang?: { sv?: string }; prefLabel?: string }[];
    contribution?: { agent?: { givenName?: string; familyName?: string } }[];
    subject?: { prefLabel?: string }[];
  };
}

// Function to fetch book info by ISBN
export const fetchBookInfoByISBN = async (isbn: string): Promise<BookInfo> => {
  const url = `https://libris-qa.kb.se/find?q=isbn:${isbn}&@type=Instance`;

  try {
    const response = await axios.get<{ items?: LibrisBookResponse[] }>(url, {
      headers: { Accept: "application/ld+json" },
    });
    if (
      response.status === 200 &&
      response.data.items &&
      response.data.items.length > 0
    ) {
      // console.log(response.data.items[0]);
      // return await parseBookInfo(response.data.items[0], isbn);
      const bookInfo = await parseBookInfo(response.data.items[0], isbn);

      await saveBookToDatabase(bookInfo);

      return bookInfo;
    } else {
      throw new Error("No book found for the given ISBN");
    }
  } catch (error: any) {
    console.error("API request failed:", error.message);
    throw new Error("API request failed: " + error.message);
  }
};

// Function to parse the book info
const parseBookInfo = async (
  data: LibrisBookResponse,
  isbn: string
): Promise<BookInfo> => {
  if (!data) {
    throw new Error("Invalid book data received");
  }
  isbn = isbn.trim();

  const extentLabel = Array.isArray(data.extent?.[0]?.label)
    ? data.extent[0].label[0] || ""
    : data.extent?.[0]?.label || "";

  //   const imageUrl = `https://xinfo.libris.kb.se/xinfo/getxinfo?identifier=/PICTURE/${img_db}/isbn/${isbn}/${isbn}.jpg/orginal`;

  const imageUrl = await fetchValidImage(isbn);

  // bokrondellen

  const bookInfo = {
    isbn,
    imageUrl,
    title: data.hasTitle?.[0]?.mainTitle || "Unknown Title",
    year: extractYear(data.publication?.[0]?.year),
    pageCount: extractPageCount(extentLabel),
    languageCode: data.instanceOf?.language?.[0]?.code || "Unknown",
    genre:
      data.instanceOf?.genreForm?.[0]?.prefLabelByLang?.sv ||
      data.instanceOf?.genreForm?.[0]?.prefLabel ||
      "Unknown",
    author: extractAuthor(data.instanceOf?.contribution),
    tags: extractTags(data.instanceOf?.subject),
  };

  return BookInfoSchema.parse(bookInfo);
};

function extractYear(year: number | string | undefined): number {
  if (typeof year === "number") return year;
  if (typeof year === "string") {
    const parsed = parseInt(year, 10);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

// Helper function to extract the page count from the extent label
function extractPageCount(extentLabel: string): number {
  if (typeof extentLabel !== "string") return 0;
  const match = extentLabel.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

function extractTags(subject?: { prefLabel?: string }[]): string[] {
  return subject
    ? subject
        .map((s) => s.prefLabel ?? "Unknown")
        .filter((tag): tag is string => Boolean(tag))
    : ["Unknown"];
}

function extractAuthor(
  contribution?: {
    agent?: { givenName?: string; familyName?: string };
  }[]
): string {
  if (!Array.isArray(contribution) || contribution.length === 0) {
    return "Unknown Author";
  }
  const agent = contribution[0].agent;
  return agent?.givenName && agent?.familyName
    ? `${agent.givenName} ${agent.familyName}`
    : "Unknown Author";
}

const fetchValidImage = async (isbn: string): Promise<string> => {
  const imageSources = ["bokrondellen", "nielsen"];
  const defaultImagePath = "../default/default_book.jpg";
  isbn = isbn.toString().trim();

  for (let img_db of imageSources) {
    const imageUrl = `https://xinfo.libris.kb.se/xinfo/getxinfo?identifier=/PICTURE/${img_db}/isbn/${isbn}/${isbn}.jpg/orginal`;

    try {
      const response = await axios.get(imageUrl, {
        responseType: "arraybuffer",
      });
      console.log(`Checking image from ${img_db} - Status: ${response.status}`);
      console.log("Headers:", response.headers);
      const contentType = response.headers["content-type"] || "";
      const contentLength =
        parseInt(response.headers["content-length"], 10) || 0;
      const isChunked = response.headers["transfer-encoding"] === "chunked";
      const isValidImage = contentType.startsWith("image/");

      console.log(`Response status: ${response.status}`);
      console.log(`Response headers:`, response.headers);
      console.log(
        `Content-Length: ${contentLength}, Content-Type: ${contentType}`
      );

      if (response.status === 200 && isValidImage) {
        if (
          isChunked ||
          response.data.byteLength > 0 ||
          response.data.byteLength > 0
        ) {
          console.log(`✅ Found valid image from ${img_db}: ${imageUrl}`);
          return imageUrl;
        } else {
          console.warn(`⚠️ Skipping ${img_db}: Empty image data.`);
        }
      } else {
        console.warn(
          `⚠️ Skipping ${img_db}: Invalid content type (${contentType}).`
        );
      }
    } catch (error: any) {
      console.warn(`❌ Error fetching image from ${img_db}:`, error.message);
      if (error.response) console.warn("Response Data:", error.response.data);
    }
  }

  return defaultImagePath;
};

const saveBookToDatabase = async (book: BookInfo) => {
  let connection: mysql.PoolConnection | null;
  try {
    console.log("🔍 Attempting to get a database connection...");
    console.log("🔍 Pool Status: ", pool);
    const connection = await pool.getConnection();
    console.log("✅ Successfully got a connection");

    const query = `
    INSERT INTO books (isbn, title, year, page_count, language, genre, author, image_url, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        title=VALUES(title), 
        year=VALUES(year), 
        page_count=VALUES(page_count), 
        language=VALUES(language), 
        genre=VALUES(genre), 
        author=VALUES(author), 
        image_url=VALUES(image_url), 
        tags=VALUES(tags)
    `;

    await connection.execute(query, [
      book.isbn,
      book.title,
      book.year,
      book.pageCount,
      book.languageCode,
      book.genre,
      book.author,
      book.imageUrl,
      JSON.stringify(book.tags),
    ]);
    console.log(`✅ Book saved: ${book.title}`);
  } catch (error: any) {
    console.error("❌ Error saving book:", error.message);
  } finally {
    if (connection) connection.release();
  }
};
