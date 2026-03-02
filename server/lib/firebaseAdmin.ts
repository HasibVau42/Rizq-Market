import admin from "firebase-admin";

let adminAuth: admin.auth.Auth;
let adminDb: admin.firestore.Firestore;
let adminStorage: admin.storage.Storage;

if (!admin.apps.length) {
  try {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
    
    if (!serviceAccountJson) {
      console.error("❌ FIREBASE_SERVICE_ACCOUNT environment variable is missing.");
    } else {
      // Check if it looks like a filename instead of JSON
      if (serviceAccountJson.trim().toLowerCase().endsWith(".json") || serviceAccountJson.trim().startsWith("firebase-ad")) {
        console.error("❌ ERROR: It looks like you pasted the FILENAME or a PATH into the FIREBASE_SERVICE_ACCOUNT secret instead of the actual JSON content.");
        console.error("Please open your .json file, copy EVERYTHING inside it (the { ... } part), and paste THAT into the secret.");
      } else {
        try {
          const serviceAccount = JSON.parse(serviceAccountJson);
          
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "rizq-market.firebasestorage.app"
          });
          console.log("✅ Firebase Admin initialized successfully.");
        } catch (parseError) {
          console.error("❌ FIREBASE_SERVICE_ACCOUNT is not a valid JSON string. Make sure you pasted the ENTIRE content of the service account JSON file, not just the filename.");
          console.error("Error details:", parseError instanceof Error ? parseError.message : String(parseError));
        }
      }
    }
  } catch (error) {
    console.error("❌ Firebase Admin initialization error:", error);
  }
}

// Export getters or handle potentially uninitialized state
export const getAdminAuth = () => {
  if (!admin.apps.length) throw new Error("Firebase Admin not initialized. Check FIREBASE_SERVICE_ACCOUNT secret.");
  return admin.auth();
};

export const getAdminDb = () => {
  if (!admin.apps.length) throw new Error("Firebase Admin not initialized. Check FIREBASE_SERVICE_ACCOUNT secret.");
  return admin.firestore();
};

export const getAdminStorage = () => {
  if (!admin.apps.length) throw new Error("Firebase Admin not initialized. Check FIREBASE_SERVICE_ACCOUNT secret.");
  return admin.storage();
};

// For backward compatibility with existing imports
export { adminAuth, adminDb, adminStorage };
