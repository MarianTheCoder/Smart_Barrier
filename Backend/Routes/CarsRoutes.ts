// Routes/LoginRoutes.ts
import express from "express";
import { getAllCars, addCar, deleteCar, updateCar } from "../Controllers/CarsController";

const router = express.Router();

router.get("/getAllCars", getAllCars);
router.post("/addCar", addCar);
router.put("/updateCar/:id", updateCar);
router.delete("/deleteCar/:id", deleteCar);

export default router;
