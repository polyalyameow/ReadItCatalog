import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import user from "./routes/user";
import stats from "./routes/stats";
import routes from "./routes/books";
import { loginUserController, registerUserController, logoutUserController } from "./controller/user";
import { verifyToken } from "./middleware/verifyJwt";


const app = express();

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.post("/proxy/login", loginUserController);
app.post("/proxy/register", registerUserController);
app.post("/proxy/logout", logoutUserController);

app.use("/api/auth", authRoutes);
app.use(verifyToken);
app.use("/api/books", routes);
app.use("/api/user", user);
app.use("/api/stats", stats);

export default app;
