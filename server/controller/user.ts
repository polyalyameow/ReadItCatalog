/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { deleteUserBook, getUserSavedBooks, loginUser, logoutUser, patchBookFeedbackByUserBookId, registerUser } from "../service/user";
import { UserLoginSchema, UserRegistrationSchema, UserLogin, UserRegistration, BookFeedbackSchema } from "../../shared/types/types";
import logger from "../../shared/logger";
import { AuthRequest } from "../middleware/verifyJwt";
import { db } from "../config/db";
import { userBookFeedback, userBooks } from "../db/schema";
import { eq, and } from "drizzle-orm";

export const getUserSavedBooksController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.currentUser?.id as string;
    const savedBooks = await getUserSavedBooks(userId);
    res.status(200).json(savedBooks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user saved books", error });
  }
};

export const patchBookFeedbackController = async (req: AuthRequest, res: Response): Promise<void> => {
  const { userBookId } = req.params;
  const parseResult = BookFeedbackSchema.safeParse(req.body);

  if (!parseResult.success) {
    res.status(400).json({
      message: "Invalid input",
      errors: parseResult.error.flatten(),
    });
    return;
  }

  try {
    const data = parseResult.data;

    const feedbackRow = await db
      .select()
      .from(userBookFeedback)
      .leftJoin(userBooks, eq(userBooks.id, userBookFeedback.user_book_id))
      .where(
        and(
          eq(userBookFeedback.user_book_id, Number(userBookId)),
          eq(userBooks.user_id, req.currentUser!.id)
        )
      )
      .execute();

    if (feedbackRow.length === 0) {
      res.status(403).json({ message: "You do not own this book entry" });
      return;
    }

    await patchBookFeedbackByUserBookId(Number(userBookId), data);

    res.status(200).json({ message: "Feedback updated successfully" });
  } catch (error: any) {
    if (!(error instanceof Error)) {
      return;
    }
    logger.error(error);
    res.status(500).json({ message: error.message || "Could not update feedback" });
  }
};


export const deleteUserBookController = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.currentUser?.id;
  const userBookId = req.params.userBookId;

  if (!userId || isNaN(userBookId)) {
    res.status(400).json({ message: "Invalid user or book ID" });
    return;
  }

  try {
    const result = await deleteUserBook(userId, userBookId);
    if (result) {
      res.status(200).json({ message: "Book deleted successfully" });
    } else {
      res.status(404).json({ message: "Book not found or does not belong to the user" });
    }
  } catch (error: any) {
    if (!(error instanceof Error)) {
      return;
    }
    logger.error("Error deleting user book", error);
    res.status(500).json({ message: "Failed to delete book", error: error.message });
  }
};

export const registerUserController = async (req: Request, res: Response): Promise<void> => {

  const parseResult = UserRegistrationSchema.safeParse(req.body);

  if (!parseResult.success) {
    res.status(400).json({ message: 'Invalid input', errors: parseResult.error.flatten() });
    return;
  }

  const data = parseResult.data as UserRegistration;

  try {
    const { token, user } = await registerUser(data);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user,
    });
  } catch (error: any) {
    if (!(error instanceof Error)) {
      return;
    }
    logger.error(error);
    res.status(400).json({ message: error.message || 'Registration failed' });
  }
};

export const loginUserController = async (req: Request, res: Response): Promise<void> => {
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
    if (!(error instanceof Error)) {
      return;
    }
    logger.error(error);
    res.status(401).json({
      message: error.message || "Login failed",
    });
  }

};

export const logoutUserController = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(400).json({ message: "No token provided" });
      return;
    }

    await logoutUser(token);

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error: any) {
    if (!(error instanceof Error)) {
      return;
    }
    res.status(500).json({ message: "Logout failed", error });
  }
};
