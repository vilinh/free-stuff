import express from "express";
import userModel from "../models/user.js";
import {
  findUserByUid,
  addUser,
  updateUserById,
  removeUserByUid,
} from "../services/user-services.js";

const router = express.Router();

// get user by firebase uid
router.get("/:uid", async (req, res) => {
  const uid = req.params["uid"];
  let result = await findUserByUid(uid);
  if (result == undefined || result.length == 0) {
    res.status(404).send("Resource not found.");
  } else {
    res.status(200).send(result);
  }
});

router.post("/", async (req, res) => {
  const userToAdd = new userModel(req.body);
  let result = await addUser(userToAdd);
  if (result === undefined) {
    res.status(500).send("An error occurred in the server.");
  } else {
    res.status(201).send(userToAdd);
  }
});

router.put("/:id", async (req, res) => {
  const id = req.params["id"];
  const result = await updateUserById(id, req.body);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.status(204).end();
  }
});

// delete user by firebase uid
router.delete("/:uid", async (req, res) => {
  const uid = req.params["uid"];
  let result = await removeUserByUid(uid);
  if (result == undefined) {
    res.status(404).send("Resource not found");
  } else {
    res.status(204).end();
  }
});

export default router;
