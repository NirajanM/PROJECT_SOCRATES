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
} from "./controllers/geofencingControllers.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

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

app.listen(config.port, () => {
  console.log(`Server running at ${config.hostUrl}`);
});
