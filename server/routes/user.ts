import express, { Router } from "express";
import { deleteUserBookController, getUserSavedBooksController, patchBookFeedbackController } from "../controller/user";

const router: Router = express.Router();

router.get("/my-books", getUserSavedBooksController);
router.patch('/my-books/:userBookId/feedback', patchBookFeedbackController);
router.delete("/my-books/:userBookId", deleteUserBookController);

export default router;