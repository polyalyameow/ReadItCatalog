import express from "express";
import routes from "./routes/routes";

const app = express();
const port = 8080;

app.use(express.json());
app.use("/api/books", routes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
