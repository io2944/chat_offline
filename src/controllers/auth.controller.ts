import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, findUserByUsername } from "../managers/users.manager.js";

const authRouter = Router();
const JWT_SECRET = process.env.JWT_SECRET || "secret";

authRouter.post("/register", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const existingUser = findUserByUsername(username);
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  createUser({ username, password: hashedPassword });

  res.status(201).json({ message: "Registered" });
  //todo add token
});

authRouter.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = findUserByUsername(username);

  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

export default authRouter;
