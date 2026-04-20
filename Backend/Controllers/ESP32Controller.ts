import vision from "@google-cloud/vision";
import path from "path";
import fs from "fs";
import { Request, Response } from "express";

const client = new vision.ImageAnnotatorClient({
  keyFilename: path.join(process.cwd(), "google-key.json"),
});

const uploadDir = path.join(process.cwd(), "uploads");

export const processOCR = async (imagePath: string) => {
  try {
    console.log("-----------------------------------------");
    console.log(`🚀 GOOGLE VISION SCANNING: ${path.basename(imagePath)}`);

    const [result] = await client.textDetection(imagePath);
    const detections = result.textAnnotations;

    if (!detections || detections.length === 0) {
      console.log("❌ GOOGLE SAW NOTHING.");
      return null;
    }

    const rawText = detections[0].description || "";
    const cleanText = rawText.toUpperCase().replace(/[^A-Z0-9]/g, "");
    console.log(`💬 CLEANED: "${cleanText}"`);
    const plateRegex = /([A-Z]{2}[0-9]{2}[A-Z]{3})/;
    const match = cleanText.match(plateRegex);

    if (match) {
      console.log(`✅ PLATE DETECTED: ${match[0]}`);
      return match[0];
    }
    return null;
  } catch (error) {
    console.error("❌ GOOGLE API CRASH:", error);
    return null;
  }
};

export const uploadPlates = async (req: Request, res: Response) => {
  try {
    // Generate filename
    const fileName = `photo_${Date.now()}.jpg`;
    const filePath = path.join(uploadDir, fileName);

    // req.body is a Buffer because of express.raw in the route
    fs.writeFile(filePath, req.body, async (err) => {
      if (err) {
        console.error("💾 Save Error:", err);
        return res.status(500).send("RETRY"); // Tell ESP32 to try again
      }
      console.log(`📸 New Image: ${fileName}`);
      // Process with Google
      const testFilePath = path.join(uploadDir, "photo_1776256058984.jpg");
      const plate = await processOCR(testFilePath);

      if (plate) {
        // SUCCESS: Send OK to trigger the Servo
        return res.status(200).send("OK");
      } else {
        // FAILURE: Send RETRY so the ESP32 tries shot #2 or #3
        return res.status(200).send("RETRY");
      }
    });
  } catch (error) {
    console.error("Upload Logic Error:", error);
    res.status(500).send("RETRY");
  }
};
