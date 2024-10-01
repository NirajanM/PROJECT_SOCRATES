const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs } = require("firebase/firestore");
const express = require("express");
const app = express();
const port = 3000;
require("dotenv").config();

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId,
};
const fireApp = initializeApp(firebaseConfig);
const db = getFirestore(fireApp);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/users", async (req, res) => {
  const userCollection = collection(db, "Users");
  const UDoc = await getDocs(userCollection);
  const UsersData = UDoc.docs.map((doc) => doc.data());
  res.json(UsersData);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
