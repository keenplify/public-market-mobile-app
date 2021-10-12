import logger from "./Logger";
import { validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { User } from ".prisma/client";
import jwt from "jsonwebtoken";

export const pErr = (err: Error) => {
  if (err) {
    logger.err(err);
  }
};

/**
 *Sends the error in express-validation with error 400.
 */
export const sendValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return next();
};

/**
 *Uses JWT Authentication as middleware (no session)
 */
export const authenticate = passport.authenticate("jwt", { session: false });

/**
 *Checks if the authenticated user is an admin. If not, it will return error 403.
 */
export const isAdmin = (req: Request, res: Response) => {
  const user = req.user as User;
  if (user!.type !== "ADMIN")
    res.status(403).send({
      message: "You are not an admin!",
    });
};

/**
 *Checks if the authenticated user is a customer . If not, it will return error 403.
 */
export const isCustomer = (req: Request, res: Response) => {
  const user = req.user as User;
  if (user!.type !== "CUSTOMER")
    res.status(403).send({
      message: "You are not a customer!",
    });
};

/**
 *Checks if the authenticated user is a seller . If not, it will return error 403.
 */
export const isSeller = (req: Request, res: Response) => {
  const user = req.user as User;
  if (user!.type !== "SELLER")
    res.status(403).send({
      message: "You are not a seller!",
    });
};

/**
 *Creates JWT Token with user
 */
export const createJWT = (user: User) =>
  jwt.sign(user, process.env.JWT_SECRET!);
export const getRandomInt = () => {
  return Math.floor(Math.random() * 1_000_000_000_000);
};
