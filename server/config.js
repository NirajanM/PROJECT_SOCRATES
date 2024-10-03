import dotenv from "dotenv";
import assert from "assert";

dotenv.config();

const {
  PORT,
  HOST,
  HOST_URL,
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId,
} = process.env;

assert(PORT, "Port is required");
assert(HOST, "Host is required");

export default {
  port: process.env.PORT || 3000, // Default to 3000 if PORT is not set
  host: HOST,
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
