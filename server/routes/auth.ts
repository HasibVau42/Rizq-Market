import express from "express";
import { getAdminAuth, getAdminDb } from "../lib/firebaseAdmin.js";

const router = express.Router();

router.post("/sync-user", async (req, res) => {
  try {
    const adminDb = getAdminDb();
    const { uid, email, name } = req.body;
    
    const userRef = adminDb.collection("users").doc(uid);
    const doc = await userRef.get();
    
    if (!doc.exists) {
      await userRef.set({
        name,
        email,
        role: "user",
        createdAt: new Date().toISOString()
      });
    }
    
    const userData = (await userRef.get()).data();
    res.json({ ...userData, _id: uid });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
