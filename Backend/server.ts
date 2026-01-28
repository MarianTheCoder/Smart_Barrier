import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./Routes/authRoutes";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// routes
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
