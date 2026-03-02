import admin from "firebase-admin";

if (!admin.apps.length) {
  try {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!serviceAccountJson) {
      throw new Error("FIREBASE_SERVICE_ACCOUNT environment variable is missing.");
    }

    const serviceAccount = JSON.parse(serviceAccountJson);
    if (!serviceAccount.project_id) {
      throw new Error("Service account object must contain a string \"project_id\" property.");
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET
    });
    console.log("Firebase Admin initialized successfully.");
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
export const adminStorage = admin.storage();
