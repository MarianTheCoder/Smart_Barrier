import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { db } from "../Utils/db";
import { RowDataPacket } from "mysql2/promise";

interface UserRow extends RowDataPacket {
  id: number;
  nume: string;
  email: string;
  password: string;
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log("Login attempt:", { email }); // Log the email for debugging
  if (!email || !password) return res.status(400).json({ message: "Toate câmpurile sunt obligatorii." });

  try {
    const [rows] = await db.execute<UserRow[]>(`SELECT * FROM Utilizatori WHERE email = ?`, [email.trim()]);

    if (rows.length === 0) return res.status(400).json({ message: "Date de autentificare invalide." });

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.parola);
    if (!isPasswordValid) return res.status(400).json({ message: "Date de autentificare invalide." });

    const tokenPayload = {
      id: user.id,
      name: user.nume,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!);

    res.status(200).json({
      message: "Login reușit",
      token,
    });
  } catch (err) {
    console.log("Eroare la autentificare utilizator:", err);
    res.status(500).json({ message: "Eroare la baza de date." });
  }
};
