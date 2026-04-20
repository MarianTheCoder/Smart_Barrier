// Routes/LoginRoutes.ts
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { login } from "../Controllers/authController";
import { authenticateToken, AuthenticatedRequest } from "../Middleware/authMiddleware";

const router = express.Router();

router.post("/login", login);

router.get("/checkToken", authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    // req.user is set by the middleware
    if (!req.user) return res.status(401).json({ message: "Token invalid." });

    const payload = {
      id: req.user.id,
      name: req.user.name, // use `name`, not `user`
    };

    const newToken = jwt.sign(payload, process.env.JWT_SECRET!);

    res.status(200).json({
      success: true,
      token: newToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Eroare la generarea refresh-ului." });
  }
});

export default router;
