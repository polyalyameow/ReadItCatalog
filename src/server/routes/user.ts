import express, { Router } from "express";
import { getUserSavedBooksController } from "../controller/user";

const router: Router = express.Router();

router.get("/my-books", getUserSavedBooksController);

export default router;