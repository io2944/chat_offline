import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, findUserByUsername } from "../managers/users.manager.js";

const authRouter = Router();
const JWT_SECRET = process.env.JWT_SECRET ?? "";

// TODO verify post body
authRouter.post("/register", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const existingUser = findUserByUsername(username);
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = createUser({ username, password: hashedPassword });
  if (!user) {
    return res.status(500);
  }
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: "1h" });

  return res.status(201).json({ token: token, currentUser: user });
});

authRouter.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  let user = findUserByUsername(username);

  console.log(user);

  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });
  const { password: _, ...publicUser } = user;

  const token = jwt.sign(publicUser, JWT_SECRET, { expiresIn: "1h" });

  res.status(200).json({ token: token, currentUser: publicUser });
});

export default authRouter;
