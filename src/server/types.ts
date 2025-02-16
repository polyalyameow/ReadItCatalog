import { z } from "zod";

export const BookInfoSchema = z.object({
  imageUrl: z.string(),
  title: z.string(),
  year: z.preprocess((val) => {
    if (typeof val === "string") {
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? undefined : parsed;
    }
    return val;
  }, z.number().optional()),
  pageCount: z.number().optional(),
  languageCode: z.string().optional(),
  genre: z.string().optional(),
  author: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type BookInfo = z.infer<typeof BookInfoSchema>;
