import admin from "../lib/firebaseAdmin.js"; // Use firebase-admin for server-side operations

const db = admin.firestore();

export const getGeofencingData = async (req, res, next) => {
  const enumeratorId = req.params.enumeratorId;

  try {
    // Fetch geofences where the assignedEnumerator matches the enumeratorId
    const geofencesSnapshot = await db
      .collection("geofences")
      .where("assignedEnumerator", "==", `/enumerators/${enumeratorId}`)
      .get();

    // Transform the Firestore snapshot into an array of geofence objects
    const geofences = geofencesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Send the geofences as the response
    res.status(200).json(geofences);
  } catch (error) {
    console.error("Error fetching geofencing data:", error);
    res.status(500).send({
      message: "Failed to fetch geofencing data.",
      error: error.message,
    });
  }
};

export const saveGeofence = async (req, res) => {
  const { enumeratorId, supervisorId } = req.params;
  const { name, area } = req.body;
  try {
    if (!name || !area || !Array.isArray(area)) {
      return res.status(400).json({ error: "Invalid geofence data." });
    }

    // Build references for enumerator and supervisor
    const enumeratorRef = db.collection("Enumerators").doc(enumeratorId);
    const supervisorRef = db.collection("supervisors").doc(supervisorId);

    // Check if the enumerator and supervisor exist
    const [enumeratorDoc, supervisorDoc] = await Promise.all([
      enumeratorRef.get(),
      supervisorRef.get(),
    ]);

    if (!enumeratorDoc.exists) {
      console.log("Enumerator not found.");
      return res.status(404).json({ error: "Enumerator not found." });
    }
    if (!supervisorDoc.exists) {
      console.log("Supervisor not found.");
      return res.status(404).json({ error: "Supervisor not found." });
    }

    // Save the geofence in the `geofences` collection
    const geofenceRef = db.collection("geofences").doc();
    await geofenceRef.set({
      name,
      area, // Array of lat/lng objects
      assignedEnumerator: enumeratorRef.path,
      supervisor: supervisorRef.path,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res
      .status(201)
      .json({ message: "Geofence saved successfully.", id: geofenceRef.id });
  } catch (error) {
    console.error("Error saving geofence:", error);
    res.status(500).json({ error: "Failed to save geofence." });
  }
};
