import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt.js";
import jwt from "jsonwebtoken";
import { PublicUser } from "../models/user.model.js";

export interface AuthenticatedRequest extends Request {
  currentUser: PublicUser;
}

export const checkToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  const jwtResponse = verifyToken(token);
  console.log(jwtResponse, process.env.JWT_SECRET);
  if (jwtResponse instanceof jwt.JsonWebTokenError) {
    return res.status(403).json(jwtResponse);
  }
  req.currentUser = jwtResponse;
  next();
};

export const wsCheckToken = (
  ws: WebSocket,
  req: Request,
  next: (err?: any) => void
) => {
  const token = req.headers.authorization;

  if (!token) {
    ws.close(1008, "Unauthorized"); // policy violation
    return;
  }
  const jwtResponse = verifyToken(token);
  if (jwtResponse instanceof jwt.JsonWebTokenError) {
    return ws.close(1008, "Invalid token");
  }
  req.currentUser = jwtResponse;
  next();
};
