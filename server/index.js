import express from "express";
import cors from "cors";

import config from "./config.js";
import {
  activateEnumerator,
  assignEnumerator,
  createUser,
  deactivateEnumerator,
  deleteUser,
  getAssignableEnumerators,
  getEnumerators,
  getUsers,
  removeSupervision,
} from "./controllers/userControllers.js";

import authenticateToken from "./middleware/authenticateToken.js";
import {
  getCollectedData,
  getGeofencingData,
  getLiveLocations,
  saveGeofence,
  archiveGeofence,
} from "./controllers/geofencingControllers.js";

import path from "path";
import { fileURLToPath } from "url";

// Get the directory name of the current module (needed with ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from the React app's build folder
// app.use(express.static(path.join(__dirname, "public")));

// // Catch-all route to serve `index.html` for any unknown routes
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

// app.get("/api/users", getUsers);

// app.post("/api/createuser", createUser);

// app.delete("/api/deleteuser/:uid", deleteUser);

app.get("/api/enumerators/:supervisorId", authenticateToken, getEnumerators);

app.get(
  "/api/assignable-enumerators",
  authenticateToken,
  getAssignableEnumerators
);

app.get("/api/geofencing/:enumeratorId", getGeofencingData);

app.get(
  "/api/live-locations/:supervisorId",
  authenticateToken,
  getLiveLocations
);

app.get("/api/collected-data/:geofenceId", authenticateToken, getCollectedData);

app.patch(
  "/api/assign-enumerator/:enumeratorId",
  authenticateToken,
  assignEnumerator
);

app.patch(
  "/api/deactivate-enumerator/:enumeratorId",
  authenticateToken,
  deactivateEnumerator
);

app.patch(
  "/api/activate-enumerator/:enumeratorId",
  authenticateToken,
  activateEnumerator
);

app.patch(
  "/api/remove-supervision/:enumeratorId",
  authenticateToken,
  removeSupervision
);

app.post(
  "/api/geofencing/:enumeratorId/:supervisorId",
  authenticateToken,
  saveGeofence
);

app.patch(
  "/api/remove-geofence/:geofenceId",
  authenticateToken,
  archiveGeofence
);

app.listen(config.port, () => {
  console.log(`Server running at ${config.hostUrl}`);
});
