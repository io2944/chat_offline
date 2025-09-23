import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt.js";
import jwt from "jsonwebtoken";
import { PublicUser } from "../models/user.model.js";

export interface AuthenticatedRequest extends Request {
  currentUser?: PublicUser;
}

export const checkToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  const jwtResponse = verifyToken(token);

  if (jwtResponse instanceof jwt.JsonWebTokenError) {
    return res.status(403).json(jwtResponse);
  }
  req.currentUser = jwtResponse;
  next();
};
