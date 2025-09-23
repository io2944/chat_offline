import jwt, { JsonWebTokenError } from "jsonwebtoken";
import dotenv from "dotenv";
import { User, PublicUser } from "../models/user.model.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET ?? "";

export const generateToken = (payload: User) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "20min" });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as PublicUser;
  } catch (error) {
    return error as JsonWebTokenError;
  }
};
