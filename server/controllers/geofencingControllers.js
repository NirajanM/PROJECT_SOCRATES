import admin from "../lib/firebaseAdmin.js"; // Use firebase-admin for server-side operations

const db = admin.firestore();
const { GeoPoint } = admin.firestore;

export const getGeofencingData = async (req, res) => {
  const enumeratorId = req.params.enumeratorId;

  try {
    // Get the enumerator document
    const enumeratorRef = db.collection("Enumerators").doc(enumeratorId);
    const enumeratorDoc = await enumeratorRef.get();

    if (!enumeratorDoc.exists) {
      return res.status(404).json({ error: "Enumerator not found." });
    }

    // Extract assigned geofences references
    const { assignedGeofences } = enumeratorDoc.data();

    if (!assignedGeofences || assignedGeofences.length === 0) {
      return res.status(200).json([]); // No geofences assigned
    }

    // Resolve geofence references
    const geofenceDocs = await Promise.all(
      assignedGeofences.map((geofenceRef) => geofenceRef.get())
    );

    // Map geofence documents into a response format
    const geofences = geofenceDocs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

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

    // Ensure the geofence area is a closed loop
    const isClosedLoop =
      area[0].lat === area[area.length - 1].lat &&
      area[0].lng === area[area.length - 1].lng;
    if (!isClosedLoop) {
      area.push(area[0]); // Close the loop by adding the first point as the last point
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
      return res.status(404).json({ error: "Enumerator not found." });
    }
    if (!supervisorDoc.exists) {
      return res.status(404).json({ error: "Supervisor not found." });
    }

    // Convert area to Firestore GeoPoints
    const geofenceArea = area.map(({ lat, lng }) => {
      if (typeof lat !== "number" || typeof lng !== "number") {
        throw new Error("Invalid latitude or longitude in area data.");
      }
      return new GeoPoint(lat, lng);
    });

    // Save the geofence in the `geofences` collection
    const geofenceRef = db.collection("geofences").doc();
    await geofenceRef.set({
      name,
      area: geofenceArea, // Save GeoPoints
      assignedEnumerator: enumeratorRef,
      supervisor: supervisorRef,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await enumeratorRef.update({
      assignedGeofences: admin.firestore.FieldValue.arrayUnion(geofenceRef),
    });

    res
      .status(201)
      .json({ message: "Geofence saved successfully.", id: geofenceRef.id });
  } catch (error) {
    console.error("Error saving geofence:", error);
    res.status(500).json({ error: "Failed to save geofence." });
  }
};
