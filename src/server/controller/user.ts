import { Request, Response } from "express";
import { getUserSavedBooks, loginUser, registerUser } from "../service/user";
import { UserLoginSchema, UserRegistrationSchema, UserLogin, UserRegistration } from "../../types/types";
import logger from "../logger";
import { AuthRequest } from "../middleware/verifyJwt";

// @TODO: change userId after jwt implementation
export const getUserSavedBooksController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.currentUser?.id as string;
    const savedBooks = await getUserSavedBooks(userId);
    res.status(200).json(savedBooks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user saved books", error });
  }
};


export const registerUserController = async (req: Request, res: Response): Promise<void>  => {
  console.log("register hit");
  const parseResult = UserRegistrationSchema.safeParse(req.body);

  if (!parseResult.success) {
    res.status(400).json({ message: 'Invalid input', errors: parseResult.error.flatten() });
    return;
  }

  const data = parseResult.data as UserRegistration;

  try {
    const {token, user} = await registerUser(data);

      res.status(201).json({
      message: 'User created successfully',
      token,
      user,
    });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ message: error.message || 'Registration failed' });
  }
};

export const loginUserController = async (req: Request, res: Response): Promise<void>  => {
  const parseResult = UserLoginSchema.safeParse(req.body);

  if (!parseResult.success) {
      res.status(400).json({
      message: "Invalid input",
      errors: parseResult.error.flatten(),
    });
    return;
  }

  const data = parseResult.data as UserLogin;

  try {
    const result = await loginUser(data);
    res.status(200).json({
      message: "Login successful",
      ...result,
    });
  } catch (error: any) {
    logger.error(error);
    res.status(401).json({
      message: error.message || "Login failed",
    });
  }

};