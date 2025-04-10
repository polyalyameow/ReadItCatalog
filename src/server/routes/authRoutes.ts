import express from "express";
import { loginUserController, logoutUserController, registerUserController } from "../controller/user";


const router = express.Router();

router.post("/register", registerUserController);
router.post("/login", loginUserController);
router.post("/logout", logoutUserController);

export default router;
