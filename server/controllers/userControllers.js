import firebase from "../lib/firebase.js";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import User from "../model/userModel.js";

const db = getFirestore(firebase);

export const createUser = async (req, res, next) => {
  try {
    const data = req.body;
    await addDoc(collection(db, "Users"), data);
    res.status(200).send("User created successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await getDocs(collection(db, "Users"));
    const UsersData = users.docs.map((doc) => doc.data());
    res.status(200).send(UsersData);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getEnumerators = async (req, res, next) => {
  const supervisorId = req.params.supervisorId;
  try {
    const users = await getDocs(collection(db, "Enumerators"));
    const enumerators = users.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((user) => user.supervisor?.id === supervisorId); // Filtering by supervisor reference ID

    res.status(200).json(enumerators);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const uid = req.params.uid;
    await deleteDoc(doc(db, "Users", uid));
    res.status(200).send("User deleted successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};
