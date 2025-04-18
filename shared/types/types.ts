import { z } from "zod";

export const BookInfoSchema = z.object({
  isbn: z.string(),
  image_url: z.string(),
  title: z.string(),
  year: z.preprocess((val) => {
    if (typeof val === "string") {
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? undefined : parsed;
    }
    return val;
  }, z.number().optional()),
  page_count: z.number().optional(),
  language: z.string().optional(),
  genre: z.string().optional(),
  author: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type BookInfo = z.infer<typeof BookInfoSchema>;

export const IsbnSchema = z
  .string()
  .nonempty({ message: "ISBN is required" })
  .regex(/^\d+$/, { message: "ISBN must contain only digits" })
  .max(13, { message: "ISBN must be at most 13 digits" });

export type Isbn = z.infer<typeof IsbnSchema>;

export const BookFeedbackSchema = z.object({
  month_of_reading: z
    .enum([
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ]).nullable()
    .optional(),
  year_of_reading: z.number().min(1000).max(9999, { message: 'Invalid year' }).nullable().optional(),
  rating: z
    .number()
    .min(1)
    .max(5, "The rating can be between 1 and 5 stars.")
    .nullable()
    .optional(),
  comment: z.string().max(1000, "Comment can be max 1000 characters long.").nullable().optional(),
}).strict();;

export type BookFeedback = z.infer<typeof BookFeedbackSchema>;

const BookRowSchema = BookInfoSchema.merge(BookFeedbackSchema)

export type BookRow = z.infer<typeof BookRowSchema>;

export const UserIdSchema = z.object({
  user_book_id: z.string()
});

export type UserId = z.infer<typeof UserIdSchema>;

const UserAndBookRowSchema = BookRowSchema.merge(UserIdSchema);

export type UserAndBookRow = z.infer<typeof UserAndBookRowSchema>;

export const UserRegistrationSchema = z
  .object({
    email: z.string().email({ message: "Invalid email format" }),
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirm_password: z.string().min(6, { message: "Confirm password must be at least 6 characters" }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
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

export type User = z.infer<typeof UserSchema>;