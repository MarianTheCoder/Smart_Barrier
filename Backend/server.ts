// server.ts
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { initializeDB } from "./Utils/initializeDB";
import { db } from "./Utils/db";
import authRoutes from "./Routes/authRoutes";
import fs from "fs";
import path from "path";
import { processOCR } from "./Controllers/ESP32Controller";
import ESP32Routes from "./Routes/ESP32Routes";
import carsRoutes from "./Routes/CarsRoutes";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173", "http://192.168.1.14:5173"], // your frontend URL
    credentials: true, // allow cookies / auth headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// --------------------
// Routes
// --------------------

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use("/ping", (_, res) => res.send("pong"));
app.use("/auth", authRoutes);
app.use("/ESP32", ESP32Routes);
app.use("/cars", carsRoutes);

// --------------------
// Start Server
// --------------------
async function startServer() {
  try {
    await initializeDB(db);
    const PORT = Number(process.env.PORT) || 3000;
    app.listen(PORT, "0.0.0.0", async () => {
      console.log(`✅ Server running on http://192.168.1.14:${PORT}`);
      // ========================================================
      // DIRECT CALL ON STARTUP (The Hardcoded Test)
      // ========================================================
      // const testFile = "photo_1776253456967.jpg";
      // const testPath = path.join(uploadDir, testFile);

      // if (fs.existsSync(testPath)) {
      //   console.log("🚀 Running Startup OCR Test...");
      //   const result = await processOCR(testPath);
      //   console.log(`📊 TEST RESULT: ${result ? `Found Plate [${result}]` : "FAILED TO PARSE"}`);
      // } else {
      //   console.log(`⚠️ Skip Test: File "${testFile}" not found in ${uploadDir}`);
      // }
      // ========================================================
    });
  } catch (err) {
    console.error("Error initializing DB:", err);
  }
}

startServer();
