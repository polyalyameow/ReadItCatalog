import { z } from "zod";

export const BookInfoSchema = z.object({
  id: z.string().uuid().optional(),
  isbn: z.string(),
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

export const BookFeedbackSchema = z.object({
  month: z.string().optional(),
  type: z.string().optional(),
  rating: z
    .number()
    .min(1)
    .max(5, "Betyget kan vara mellan 1 och 5 stjärnor")
    .optional(),
  comment: z.string().optional(),
});

export type BookFeedback = z.infer<typeof BookFeedbackSchema>;
