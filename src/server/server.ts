import express from "express";
import routes from "./routes/books";
import logger from "./logger";

const app = express();
const port = 8080;

app.use(express.json());
app.use("/api/books", routes);

app.listen(port, () => {
  logger.debug(`Server running at http://localhost:${port}`);
});
