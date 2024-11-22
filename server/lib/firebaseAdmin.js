// lib/firebaseAdmin.js
import admin from "firebase-admin";

// Initialize Firebase Admin SDK with the service account credentials from environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT); // Parsing the service account from the environment variable

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
