import dotenv from "dotenv";

dotenv.config();

const {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId,
} = process.env;

export default {
  port: process.env.PORT || 3000, // Default to 3000 if PORT is not set
  hostUrl: process.env.HOST_URL || "http://localhost", // Default to localhost
  firebaseConfig: {
    apiKey: apiKey,
    authDomain: authDomain,
    projectId: projectId,
    storageBucket: storageBucket,
    messagingSenderId: messagingSenderId,
    appId: appId,
    measurementId: measurementId,
  },
};
