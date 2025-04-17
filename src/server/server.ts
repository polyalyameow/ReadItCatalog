// import express from "express";
// import cors from 'cors';
// import routes from "./routes/books";
// import logger from "./logger";
// import authRoutes from "./routes/authRoutes";
// import user from "./routes/user";
// import stats from "./routes/stats";
// import { verifyToken } from "./middleware/verifyJwt";



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

import express from "express";
import cors from "cors";

// Import your route handlers
import routes from "./routes/books";
import authRoutes from "./routes/authRoutes";
import user from "./routes/user";
import stats from "./routes/stats";
import { verifyToken } from "./middleware/verifyJwt";
import logger from "./logger";
import { loginUserController, logoutUserController, registerUserController } from "./controller/user";

// Create an express app instance
const app = express();

// CORS configuration
const corsOptions = {
  origin: "http://localhost:5173", // Frontend running on port 5173
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.post("/proxy/login", (req, res) => {
  loginUserController(req, res);
});

app.post("/proxy/register", (req, res) => {
  registerUserController(req, res);
})

app.post("/proxy/logout", async (req, res) => {
   logoutUserController(req, res);
});


app.use("/api/auth", authRoutes);
app.use(verifyToken);
app.use("/api/books", routes);
app.use("/api/user", user);
app.use("/stats", stats);

const port = 8080;
app.listen(port, () => {
  logger.debug(`Server running at http://localhost:${port}`);
});
