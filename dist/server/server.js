"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const books_1 = __importDefault(require("./routes/books"));
const logger_1 = __importDefault(require("./logger"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const user_1 = __importDefault(require("./routes/user"));
const verifyJwt_1 = require("./middleware/verifyJwt");
const config_1 = require("./config/config");
console.log('JWT_SECRET loaded:', config_1.JWT_SECRET);
const app = (0, express_1.default)();
const port = 8080;
app.use(express_1.default.json());
app.use("/api/auth", authRoutes_1.default);
app.use(verifyJwt_1.verifyToken);
app.use("/api/books", books_1.default);
app.use("/api", user_1.default);
app.listen(port, () => {
    logger_1.default.debug(`Server running at http://localhost:${port}`);
});
