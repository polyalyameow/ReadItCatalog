import express, { Router } from "express";
import { getBookInfoByISBN } from "../controller/controller";

const router: Router = express.Router();

router.get("/:isbn", getBookInfoByISBN as unknown as express.RequestHandler);

export default router;
