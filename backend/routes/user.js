import express from "express";
import userModel from "../models/user.js";

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

async function findUserByUid(uid) {
  try {
    return await userModel.findOne({ uid });
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function removeUserByUid(uid) {
  try {
    let result = await userModel.findOneAndDelete({ uid });
    return result;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function addUser(user) {
  try {
    return await user.save();
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function updateUserById(id, user) {
  try {
    await userModel.findByIdAndUpdate(id, user);
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

export default router;
export { findUserByUid, addUser, removeUserByUid };
