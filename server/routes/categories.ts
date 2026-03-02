import express from "express";
import { getAdminDb } from "../lib/firebaseAdmin.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const adminDb = getAdminDb();
    const snapshot = await adminDb.collection("categories").get();
    const categories = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const adminDb = getAdminDb();
    const docRef = await adminDb.collection("categories").add(req.body);
    const newCat = await docRef.get();
    res.status(201).json({ _id: newCat.id, ...newCat.data() });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
