import express from "express";
import routes from "./routes/books";
import logger from "./logger";
import authRoutes from "./routes/authRoutes";
import user from "./routes/user";
import { verifyToken } from "./middleware/verifyJwt";


const app = express();
const port = 8080;

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use(verifyToken);
app.use("/api/books", routes);
app.use("/api", user)

app.listen(port, () => {
  logger.debug(`Server running at http://localhost:${port}`);
});
