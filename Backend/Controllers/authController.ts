import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateToken } from "../Utils/generateToken";

const users = [
  { id: 1, email: "admin@test.com", passwordHash: bcrypt.hashSync("1234", 10) },
];

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user) return res.status(401).json({ error: "User not found" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: "Invalid password" });

  const token = generateToken(user.id, user.email);
  res.json({ token, user: { id: user.id, email: user.email } });
};
