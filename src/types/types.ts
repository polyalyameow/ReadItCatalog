import { z } from "zod";

export const BookInfoSchema = z.object({
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
  month_of_reading: z
  .enum([
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ])
  .optional(),
  year_of_reading: z.string().optional(),
  rating: z
    .number()
    .min(1)
    .max(5, "The rating can be between 1 and 5 stars.")
    .optional(),
  comment: z.string().optional(),
});

export type BookFeedback = z.infer<typeof BookFeedbackSchema>;

export const UserRegistrationSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
});

export type UserRegistration = z.infer<typeof UserRegistrationSchema>;

export const UserLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type UserLogin = z.infer<typeof UserLoginSchema>;

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
});

export type User= z.infer<typeof UserSchema>;