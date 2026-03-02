import express from "express";
import multer from "multer";
import { getAdminStorage } from "../lib/firebaseAdmin.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.array("images", 5), async (req: any, res) => {
  try {
    const adminStorage = getAdminStorage();
    const files = req.files as any[];
    const urls = [];

    for (const file of files) {
      const fileName = `${uuidv4()}-${file.originalname}`;
      const fileUpload = adminStorage.bucket().file(`products/${fileName}`);
      
      await fileUpload.save(file.buffer, {
        metadata: { contentType: file.mimetype }
      });

      // Make the file public or get a signed URL
      // For simplicity, we'll use a public URL if the bucket allows it
      // or a standard Firebase Storage URL format
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${adminStorage.bucket().name}/o/products%2F${fileName}?alt=media`;
      urls.push(publicUrl);
    }

    res.json({ urls });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
