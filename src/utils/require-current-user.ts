import { AuthenticatedRequest } from "../middlewares/check-token.js";
import { Request } from "express";

export const ensureCurrentUser = (req: Request): AuthenticatedRequest => {
  if (!(req as any).currentUser) {
    throw new Error("currentUser not found");
  }
  return req as AuthenticatedRequest;
};
