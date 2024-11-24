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

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// app.get("/users", getUsers);

// app.post("/createuser", createUser);

// app.delete("/deleteuser/:uid", deleteUser);

app.get("/enumerators/:supervisorId", authenticateToken, getEnumerators);

app.get("/assignable-enumerators", authenticateToken, getAssignableEnumerators);

app.patch(
  "/assign-enumerator/:enumeratorId",
  authenticateToken,
  assignEnumerator
);

app.patch(
  "/deactivate-enumerator/:enumeratorId",
  authenticateToken,
  deactivateEnumerator
);

app.patch(
  "/activate-enumerator/:enumeratorId",
  authenticateToken,
  activateEnumerator
);

app.patch(
  "/remove-supervision/:enumeratorId",
  authenticateToken,
  removeSupervision
);

app.listen(config.port, () => {
  console.log(`Server running at ${config.hostUrl}`);
});
