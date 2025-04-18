import express from "express";
import { loginUserController, logoutUserController, registerUserController } from "../controller/user";
import { AuthRequest, verifyToken } from "../middleware/verifyJwt";


const router = express.Router();

router.post("/register", registerUserController);
router.post("/login", loginUserController);
router.post("/logout", logoutUserController);


router.get("/verify", verifyToken, (req: AuthRequest, res) => {
  res.status(200).json({ message: "Token is valid", user: req.currentUser });
});


export default router;
