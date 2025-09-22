import express, { Request, Response } from "express";

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Offline Chat Server is running!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
