"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookInfoSchema = void 0;
const zod_1 = require("zod");
exports.BookInfoSchema = zod_1.z.object({
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
