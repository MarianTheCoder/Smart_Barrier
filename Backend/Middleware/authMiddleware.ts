import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { db } from "../Utils/db";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    name: string;
  };
}

export async function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  // Make sure authHeader is a string
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];
  const token = Array.isArray(authHeader) ? authHeader[0]?.split(" ")[1] : authHeader?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Niciun token furnizat." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload & { id: number };

    const [rows] = (await db.execute("SELECT nume FROM Utilizatori WHERE id = ?", [decoded.id])) as any[];

    if (rows.length === 0) return res.status(401).json({ message: "Cont inexistent." });

    req.user = {
      id: decoded.id,
      name: rows[0].nume,
    };

    next();
  } catch (err) {
    console.error("Eroare la verificarea token-ului:", err);
    res.status(401).json({ message: "Token invalid." });
  }
}
