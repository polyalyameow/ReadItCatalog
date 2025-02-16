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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchBookInfoByISBN = void 0;
const axios_1 = __importDefault(require("axios"));
const types_1 = require("../types");
// Function to fetch book info by ISBN
const fetchBookInfoByISBN = (isbn) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `https://libris-qa.kb.se/find?q=isbn:${isbn}&@type=Instance`;
    try {
        const response = yield axios_1.default.get(url, {
            headers: { Accept: "application/ld+json" },
        });
        if (response.status === 200 &&
            response.data.items &&
            response.data.items.length > 0) {
            console.log(response.data.items[0]);
            return yield parseBookInfo(response.data.items[0], isbn);
        }
        else {
            throw new Error("No book found for the given ISBN");
        }
    }
    catch (error) {
        console.error("API request failed:", error.message);
        throw new Error("API request failed: " + error.message);
    }
});
exports.fetchBookInfoByISBN = fetchBookInfoByISBN;
// Function to parse the book info
const parseBookInfo = (data, isbn) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
    if (!data) {
        throw new Error("Invalid book data received");
    }
    const extentLabel = Array.isArray((_b = (_a = data.extent) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.label)
        ? data.extent[0].label[0] || ""
        : ((_d = (_c = data.extent) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.label) || "";
    //   const imageUrl = `https://xinfo.libris.kb.se/xinfo/getxinfo?identifier=/PICTURE/${img_db}/isbn/${isbn}/${isbn}.jpg/orginal`;
    const imageUrl = yield fetchValidImage(isbn);
    // bokrondellen
    const bookInfo = {
        imageUrl,
        title: ((_f = (_e = data.hasTitle) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.mainTitle) || "Unknown Title",
        year: extractYear((_h = (_g = data.publication) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.year),
        pageCount: extractPageCount(extentLabel),
        languageCode: ((_l = (_k = (_j = data.instanceOf) === null || _j === void 0 ? void 0 : _j.language) === null || _k === void 0 ? void 0 : _k[0]) === null || _l === void 0 ? void 0 : _l.code) || "Unknown",
        genre: ((_q = (_p = (_o = (_m = data.instanceOf) === null || _m === void 0 ? void 0 : _m.genreForm) === null || _o === void 0 ? void 0 : _o[0]) === null || _p === void 0 ? void 0 : _p.prefLabelByLang) === null || _q === void 0 ? void 0 : _q.sv) ||
            ((_t = (_s = (_r = data.instanceOf) === null || _r === void 0 ? void 0 : _r.genreForm) === null || _s === void 0 ? void 0 : _s[0]) === null || _t === void 0 ? void 0 : _t.prefLabel) ||
            "Unknown",
        author: extractAuthor((_u = data.instanceOf) === null || _u === void 0 ? void 0 : _u.contribution),
        tags: extractTags((_v = data.instanceOf) === null || _v === void 0 ? void 0 : _v.subject),
    };
    return types_1.BookInfoSchema.parse(bookInfo);
});
function extractYear(year) {
    if (typeof year === "number")
        return year;
    if (typeof year === "string") {
        const parsed = parseInt(year, 10);
        return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
}
// Helper function to extract the page count from the extent label
function extractPageCount(extentLabel) {
    if (typeof extentLabel !== "string")
        return 0;
    const match = extentLabel.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
}
function extractTags(subject) {
    return subject
        ? subject
            .map((s) => { var _a; return (_a = s.prefLabel) !== null && _a !== void 0 ? _a : "Unknown"; })
            .filter((tag) => Boolean(tag))
        : ["Unknown"];
}
function extractAuthor(contribution) {
    if (!Array.isArray(contribution) || contribution.length === 0) {
        return "Unknown Author";
    }
    const agent = contribution[0].agent;
    return (agent === null || agent === void 0 ? void 0 : agent.givenName) && (agent === null || agent === void 0 ? void 0 : agent.familyName)
        ? `${agent.givenName} ${agent.familyName}`
        : "Unknown Author";
}
const fetchValidImage = (isbn) => __awaiter(void 0, void 0, void 0, function* () {
    const imageSources = ["bokrondellen", "nielsen"];
    const defaultImagePath = "../default/default_book.jpg";
    isbn = isbn.toString().trim();
    for (let img_db of imageSources) {
        const imageUrl = `https://xinfo.libris.kb.se/xinfo/getxinfo?identifier=/PICTURE/${img_db}/isbn/${isbn}/${isbn}.jpg/orginal`;
        try {
            const response = yield axios_1.default.get(imageUrl, {
                responseType: "arraybuffer",
            });
            console.log(`Checking image from ${img_db} - Status: ${response.status}`);
            console.log("Headers:", response.headers);
            const contentType = response.headers["content-type"] || "";
            const contentLength = parseInt(response.headers["content-length"], 10) || 0;
            const isChunked = response.headers["transfer-encoding"] === "chunked";
            const isValidImage = contentType.startsWith("image/");
            console.log(`Response status: ${response.status}`);
            console.log(`Response headers:`, response.headers);
            console.log(`Content-Length: ${contentLength}, Content-Type: ${contentType}`);
            if (response.status === 200 && isValidImage) {
                if (isChunked ||
                    response.data.byteLength > 0 ||
                    response.data.byteLength > 0) {
                    console.log(`✅ Found valid image from ${img_db}: ${imageUrl}`);
                    return imageUrl;
                }
                else {
                    console.warn(`⚠️ Skipping ${img_db}: Empty image data.`);
                }
            }
            else {
                console.warn(`⚠️ Skipping ${img_db}: Invalid content type (${contentType}).`);
            }
        }
        catch (error) {
            console.warn(`❌ Error fetching image from ${img_db}:`, error.message);
            if (error.response)
                console.warn("Response Data:", error.response.data);
        }
    }
    return defaultImagePath;
});
