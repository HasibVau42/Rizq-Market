import express from "express";
import { getAdminDb } from "../lib/firebaseAdmin.js";
import admin from "firebase-admin";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const adminDb = getAdminDb();
    const { orderItems, shippingAddress, paymentMethod, paymentDetails, totalPrice, userId } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const orderData = {
      user: userId,
      orderItems,
      shippingAddress,
      paymentMethod,
      paymentDetails,
      totalPrice,
      isPaid: false,
      isDelivered: false,
      status: "Pending",
      createdAt: new Date().toISOString()
    };

    const docRef = await adminDb.collection("orders").add(orderData);

    // Reduce stock (Batch update)
    const batch = adminDb.batch();
    for (const item of orderItems) {
      const productRef = adminDb.collection("products").doc(item.product);
      batch.update(productRef, {
        stock: admin.firestore.FieldValue.increment(-item.qty)
      });
    }
    await batch.commit();

    res.status(201).json({ _id: docRef.id, ...orderData });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get all orders (Admin)
router.get("/all", async (req, res) => {
  try {
    const adminDb = getAdminDb();
    const snapshot = await adminDb.collection("orders")
      .orderBy("createdAt", "desc")
      .get();
    const orders = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status (Admin)
router.put("/:id/status", async (req, res) => {
  try {
    const adminDb = getAdminDb();
    const { status } = req.body;
    await adminDb.collection("orders").doc(req.params.id).update({ status });
    res.json({ message: "Order status updated" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/myorders/:userId", async (req, res) => {
  try {
    const adminDb = getAdminDb();
    const snapshot = await adminDb.collection("orders")
      .where("user", "==", req.params.userId)
      .orderBy("createdAt", "desc")
      .get();
    const orders = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
