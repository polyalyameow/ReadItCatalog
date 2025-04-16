"use strict";
// import express from "express";
// import cors from 'cors';
// import routes from "./routes/books";
// import logger from "./logger";
// import authRoutes from "./routes/authRoutes";
// import user from "./routes/user";
// import stats from "./routes/stats";
// import { verifyToken } from "./middleware/verifyJwt";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const corsOptions = {
//   origin: "http://localhost:5173",
//   methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true,
// };
// // ✅ Apply CORS middleware globally (before all routes)
// const app = express();
// app.use(cors(corsOptions)); 
// app.use(express.json());
// const port = 8080;
// app.use("/api/auth", authRoutes);
// app.use(verifyToken);
// app.use("/api/books", routes);
// app.use("/api", user)
// app.use("/stats", stats)
// app.listen(port, () => {
//   logger.debug(`Server running at http://localhost:${port}`);
// });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// Import your route handlers
const books_1 = __importDefault(require("./routes/books"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const user_1 = __importDefault(require("./routes/user"));
const stats_1 = __importDefault(require("./routes/stats"));
const verifyJwt_1 = require("./middleware/verifyJwt");
const logger_1 = __importDefault(require("./logger"));
const user_2 = require("./controller/user");
// Create an express app instance
const app = (0, express_1.default)();
// CORS configuration
const corsOptions = {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.post("/proxy/login", (req, res) => {
    (0, user_2.loginUserController)(req, res);
});
app.post("/proxy/register", (req, res) => {
    (0, user_2.registerUserController)(req, res);
});
app.post("/proxy/logout", async (req, res) => {
    (0, user_2.logoutUserController)(req, res);
});
app.use("/api/auth", authRoutes_1.default);
app.use(verifyJwt_1.verifyToken);
app.use("/api/books", books_1.default);
app.use("/api/user", user_1.default);
app.use("/stats", stats_1.default);
const port = 8080;
app.listen(port, () => {
    logger_1.default.debug(`Server running at http://localhost:${port}`);
});
