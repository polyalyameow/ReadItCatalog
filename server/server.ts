import express from "express";
import cors from "cors";
import routes from "./routes/books";
import authRoutes from "./routes/authRoutes";
import user from "./routes/user";
import stats from "./routes/stats";
import { verifyToken } from "./middleware/verifyJwt";
import logger from "./utils/logger";
import { loginUserController, logoutUserController, registerUserController } from "./controller/user";

const app = express();

const corsOptions = {
  origin: "*",
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
app.use("/api/stats", stats);

const port = 8080;
app.listen(port, () => {
  logger.debug(`Server running at http://localhost:${port}`);
});