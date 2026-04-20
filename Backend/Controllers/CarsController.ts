import vision from "@google-cloud/vision";
import path from "path";
import fs from "fs";
import { Request, Response } from "express";
import { db } from "../Utils/db";

export const getAllCars = async (req: Request, res: Response) => {
  try {
    // Luăm toate mașinile, ordonate după data adăugării (cele mai noi primele)
    const [rows] = await db.execute("SELECT * FROM Masini ORDER BY data_creare DESC");

    // Trimitem datele către Frontend
    return res.status(200).json(rows);
  } catch (error) {
    console.error("Eroare la preluarea mașinilor:", error);
    return res.status(500).json({ message: "Eroare de server la preluarea datelor." });
  }
};

// Controllers/carController.ts
export const addCar = async (req: Request, res: Response) => {
  try {
    const { nume_proprietar, numar_inmatriculare, isActive } = req.body;
    const query = `INSERT INTO Masini (nume_proprietar, numar_inmatriculare, activ) VALUES (?, ?, ?)`;
    await db.execute(query, [nume_proprietar, numar_inmatriculare, isActive ? 1 : 0]);
    res.status(201).json({ message: "Vehicul adăugat!" });
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY") return res.status(400).json({ message: "Placa există deja!" });
    res.status(500).json({ message: "Eroare server" });
  }
};

export const deleteCar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.execute("DELETE FROM Masini WHERE id = ?", [id]);
    res.status(200).json({ message: "Vehicul șters!" });
  } catch (error) {
    res.status(500).json({ message: "Eroare server" });
  }
};

export const updateCar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Placa veche (identificatorul)
    console.log("Updating car with ID:", id);
    const { nume_proprietar, numar_inmatriculare, isActive } = req.body;

    const query = `
      UPDATE Masini 
      SET nume_proprietar = ?, numar_inmatriculare = ?, activ = ? 
      WHERE id = ?
    `;

    // Executăm update-ul
    const [result]: any = await db.execute(query, [nume_proprietar, numar_inmatriculare, isActive ? 1 : 0, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Vehiculul nu a fost găsit." });
    }

    res.status(200).json({ message: "Vehicul actualizat cu succes!" });
  } catch (error: any) {
    // Dacă userul schimbă numărul de înmatriculare cu unul care deja există în DB
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Acest număr de înmatriculare este deja atribuit altui vehicul!" });
    }
    console.error("Eroare la update:", error);
    res.status(500).json({ message: "Eroare server la actualizare." });
  }
};
