"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookFeedbackSchema = exports.BookInfoSchema = void 0;
const zod_1 = require("zod");
exports.BookInfoSchema = zod_1.z.object({
    isbn: zod_1.z.string(),
    imageUrl: zod_1.z.string(),
    title: zod_1.z.string(),
    year: zod_1.z.preprocess((val) => {
        if (typeof val === "string") {
            const parsed = parseInt(val, 10);
            return isNaN(parsed) ? undefined : parsed;
        }
        return val;
    }, zod_1.z.number().optional()),
    pageCount: zod_1.z.number().optional(),
    languageCode: zod_1.z.string().optional(),
    genre: zod_1.z.string().optional(),
    author: zod_1.z.string().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.BookFeedbackSchema = zod_1.z.object({
    month: zod_1.z.string().optional(),
    type: zod_1.z.string().optional(),
    rating: zod_1.z
        .number()
        .min(1)
        .max(5, "Betyget kan vara mellan 1 och 5 stjärnor")
        .optional(),
    comment: zod_1.z.string().optional(),
});
