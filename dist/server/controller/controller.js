"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookInfoByISBN = void 0;
const service_js_1 = require("../service/service.js");
const getBookInfoByISBN = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { isbn } = req.params;
    try {
        const bookInfo = yield (0, service_js_1.fetchBookInfoByISBN)(isbn);
        if (!bookInfo) {
            return res.status(404).json({ error: "Book not found" });
        }
        return res.json(bookInfo);
    }
    catch (error) {
        return res.status(500).json({ error: "Error fetching book information" });
    }
});
exports.getBookInfoByISBN = getBookInfoByISBN;
