import { z } from "zod";

const currentYear = new Date().getFullYear();

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
  .nonempty({ message: "ISBN krävs" })
  .regex(/^\d+$/, { message: "ISBN måste endast innehålla siffror" })
  .max(13, { message: "ISBN får vara högst 13 siffror" });

export type Isbn = z.infer<typeof IsbnSchema>;

export const BookFeedbackSchema = z.object({
  month_of_reading: z
    .enum([
      "Januari", "Februari", "Mars", "April", "Maj", "Juni",
      "Juli", "Augusti", "September", "Oktober", "November", "December"
    ]).nullable()
    .optional(),
  year_of_reading: z
    .number()
    .min(1930, { message: 'Ogiltigt år' })
    .max(currentYear, { message: 'Ogiltigt år' })
    .nullable()
    .optional(),
  rating: z
    .number()
    .min(1)
    .max(5, "Betyget kan vara mellan 1 och 5 stjärnor.")
    .nullable()
    .optional(),
  comment: z.string().max(1000, "Kommentaren kan vara maximalt 1000 tecken lång.").nullable().optional(),
}).strict();;

export type BookFeedback = z.infer<typeof BookFeedbackSchema>;

const BookRowSchema = BookInfoSchema.merge(BookFeedbackSchema)

export type BookRow = z.infer<typeof BookRowSchema>;

export const UserIdSchema = z.object({
  user_book_id: z.string()
});

export type UserId = z.infer<typeof UserIdSchema>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const UserAndBookRowSchema = BookRowSchema.merge(UserIdSchema);

export type UserAndBookRow = z.infer<typeof UserAndBookRowSchema>;

export const UserRegistrationSchema = z
  .object({
    email: z.string().email({ message: "Ogiltigt e-postformat" }),
    username: z.string().min(3, { message: "Användarnamn måste vara minst 3 tecken långt" }),
    password: z.string().min(6, { message: "Lösenord måste vara minst 6 tecken långt" }),
    confirm_password: z.string().min(6, { message: "Bekräfta lösenord måste vara minst 6 tecken långt" }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Lösenorden matchar inte",
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