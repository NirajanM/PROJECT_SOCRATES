import admin from "../lib/firebaseAdmin.js"; // Use firebase-admin for server-side operations
import User from "../model/userModel.js";

// Get Firestore instance from admin SDK
const db = admin.firestore();

export const createUser = async (req, res, next) => {
  try {
    const data = req.body;
    await db.collection("Users").add(data); // Use admin SDK's Firestore
    res.status(200).send("User created successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const usersSnapshot = await db.collection("Users").get(); // Use admin SDK's Firestore
    const usersData = usersSnapshot.docs.map((doc) => doc.data());
    res.status(200).send(usersData);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getEnumerators = async (req, res, next) => {
  const supervisorId = req.params.supervisorId;
  try {
    const enumeratorsSnapshot = await db.collection("Enumerators").get(); // Use admin SDK's Firestore
    const enumerators = enumeratorsSnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((user) => user.supervisor?.id === supervisorId); // Filter by supervisor reference ID

    res.status(200).json(enumerators);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const uid = req.params.uid;
    await db.collection("Users").doc(uid).delete(); // Use admin SDK's Firestore
    res.status(200).send("User deleted successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getAssignableEnumerators = async (req, res) => {
  try {
    const enumeratorsSnapshot = await db
      .collection("Enumerators")
      .where("assignable", "==", true)
      .get(); // Use admin SDK's Firestore

    const enumerators = enumeratorsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(enumerators);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch assignable enumerators." });
  }
};

export const assignEnumerator = async (req, res) => {
  const { enumeratorId } = req.params;
  const { supervisorId } = req.body;

  try {
    const enumeratorRef = db.collection("Enumerators").doc(enumeratorId);

    const supervisorRef = db.collection("supervisors").doc(supervisorId);

    await enumeratorRef.update({
      supervisor: supervisorRef,
      assignable: false,
    });

    res.status(200).json({ message: "Enumerator assigned successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to assign enumerator." });
  }
};

export const deactivateEnumerator = async (req, res) => {
  const { enumeratorId } = req.params;

  try {
    const enumeratorRef = db.collection("Enumerators").doc(enumeratorId);

    await enumeratorRef.update({
      active: false,
    });

    res.status(200).json({ message: "Enumerator deactivated successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to deactivate enumerator." });
  }
};

export const activateEnumerator = async (req, res) => {
  const { enumeratorId } = req.params;

  try {
    const enumeratorRef = db.collection("Enumerators").doc(enumeratorId);

    await enumeratorRef.update({
      active: true,
    });

    res.status(200).json({ message: "Enumerator activated successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to activate enumerator." });
  }
};

export const removeSupervision = async (req, res) => {
  const { enumeratorId } = req.params;

  try {
    const enumeratorRef = db.collection("Enumerators").doc(enumeratorId);

    await enumeratorRef.update({
      supervisor: admin.firestore.FieldValue.delete(),
      assignable: true,
    });

    res.status(200).json({ message: "Supervision removed successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove supervision." });
  }
};
