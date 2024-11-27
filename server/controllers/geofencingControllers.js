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
