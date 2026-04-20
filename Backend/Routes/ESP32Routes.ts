// Routes/LoginRoutes.ts
import express from "express";
import { processOCR, uploadPlates } from "../Controllers/ESP32Controller";

const router = express.Router();
const rawParser = express.raw({
  type: "image/jpeg",
  limit: "10mb",
});

router.post("/TestOCR", processOCR);
router.post("/upload", rawParser, uploadPlates);

export default router;
