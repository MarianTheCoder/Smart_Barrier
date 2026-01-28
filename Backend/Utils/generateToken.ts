import jwt from "jsonwebtoken";

export const generateToken = (userId: number, email: string) => {
  const secret = process.env.JWT_SECRET || "default_secret";
  return jwt.sign({ id: userId, email }, secret, { expiresIn: "1h" });
};
