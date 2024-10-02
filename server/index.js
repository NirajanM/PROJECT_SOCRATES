import express from "express";
import cors from "cors";

import config from "./config.js";
import {
  createUser,
  deleteUser,
  getUsers,
} from "./controllers/userControllers.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/users", getUsers);

app.post("/createuser", createUser);

app.delete("/deleteuser/:uid", deleteUser);

app.listen(config.port, () => {
  console.log(`Server running at ${config.hostUrl}`);
});
