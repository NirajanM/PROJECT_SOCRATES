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

export const getLiveLocations = async (req, res) => {
  const { supervisorId } = req.params;

  try {
    // Fetch the supervisor document
    const supervisorRef = db.collection("supervisors").doc(supervisorId);
    const supervisorDoc = await supervisorRef.get();

    if (!supervisorDoc.exists) {
      return res.status(404).json([]);
    }

    const { assignedEnumerators } = supervisorDoc.data();

    if (!assignedEnumerators || assignedEnumerators.length === 0) {
      return res.status(200).json([]); // Return an empty array if no enumerators assigned
    }

    // Fetch live locations for the assigned enumerators
    const liveLocationsQuerySnapshot = await db
      .collection("locations")
      .where("enumeratorID", "in", assignedEnumerators)
      .get();

    if (liveLocationsQuerySnapshot.empty) {
      return res.status(200).json([]); // Return an empty array if no live locations found
    }

    // Map live locations into the desired response format
    const liveLocations = liveLocationsQuerySnapshot.docs.map((doc) => {
      const data = doc.data();
      return data;
    });

    res.status(200).json(liveLocations);
  } catch (error) {
    console.error("Error fetching live locations:", error);
    res.status(200).json([]); // Return an empty array on any error
  }
};

export const getCollectedData = async (req, res) => {
  const { geofenceId } = req.params;

  try {
    // Query Firestore to fetch collected data related to the geofence
    const collectedDataQuerySnapshot = await db
      .collection("collectedInformation")
      .where("geofenceRef", "==", db.collection("geofences").doc(geofenceId))
      .get();

    if (collectedDataQuerySnapshot.empty) {
      return res.status(200).json([]); // Return an empty array if no data is found
    }

    // Map the Firestore data into a response format
    const collectedData = collectedDataQuerySnapshot.docs.map((doc) => {
      const data = doc.data();
      return data;
    });
    res.status(200).json(collectedData);
  } catch (error) {
    console.error("Error fetching collected data:", error);
    res.status(500).json([]);
  }
};

export const archiveGeofence = async (req, res) => {
  const { geofenceId } = req.params;

  try {
    // Reference to the geofence document
    const geofenceRef = db.collection("geofences").doc(geofenceId);
    const geofenceDoc = await geofenceRef.get();

    if (!geofenceDoc.exists) {
      return res.status(404).json({ error: "Geofence not found." });
    }

    const geofenceData = geofenceDoc.data();

    // Update the geofence's status by adding an "archived" field
    await geofenceRef.update({
      archived: true, // Mark as archived
      archivedAt: admin.firestore.FieldValue.serverTimestamp(), // Timestamp for archival
    });

    // Reference to the assigned enumerator
    const assignedEnumeratorRef = geofenceData.assignedEnumerator;
    const enumeratorDoc = await assignedEnumeratorRef.get();

    if (!enumeratorDoc.exists) {
      return res.status(404).json({ error: "Assigned enumerator not found." });
    }

    // Remove the geofence reference from the enumerator's assignedGeofences array
    await assignedEnumeratorRef.update({
      assignedGeofences: admin.firestore.FieldValue.arrayRemove(geofenceRef),
    });

    res.status(200).json({
      message: "Geofence archived and removed from enumerator successfully.",
    });
  } catch (error) {
    console.error("Error archiving geofence:", error);
    res.status(500).json({ error: "Failed to archive geofence." });
  }
};
