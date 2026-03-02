import express from "express";
import { adminDb } from "../lib/firebaseAdmin.js";

const router = express.Router();

// Get all products
router.get("/", async (req, res) => {
  try {
    const snapshot = await adminDb.collection("products").get();
    const products = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product
router.get("/:id", async (req, res) => {
  try {
    const doc = await adminDb.collection("products").doc(req.params.id).get();
    if (doc.exists) {
      res.json({ _id: doc.id, ...doc.data() });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Create product
router.post("/", async (req, res) => {
  try {
    const productData = req.body;
    const docRef = await adminDb.collection("products").add({
      ...productData,
      createdAt: new Date().toISOString()
    });
    const newProduct = await docRef.get();
    res.status(201).json({ _id: newProduct.id, ...newProduct.data() });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
