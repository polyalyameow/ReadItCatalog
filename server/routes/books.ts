import express, { Router } from "express";
import { getBookInfoByISBNController } from "../controller/books";

const router: Router = express.Router();

router.get("/:isbn", getBookInfoByISBNController as unknown as express.RequestHandler);

export default router;
