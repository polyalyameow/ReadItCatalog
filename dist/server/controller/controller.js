"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookInfoByISBN = void 0;
const service_js_1 = require("../service/service.js");
const getBookInfoByISBN = async (req, res) => {
    const { isbn } = req.params;
    try {
        const bookInfo = await (0, service_js_1.fetchBookInfoByISBN)(isbn);
        if (!bookInfo) {
            return res.status(404).json({ error: "Book not found" });
        }
        return res.json(bookInfo);
    }
    catch (error) {
        return res.status(500).json({ error: "Error fetching book information" });
    }
};
exports.getBookInfoByISBN = getBookInfoByISBN;
