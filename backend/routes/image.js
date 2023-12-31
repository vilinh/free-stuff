import express from "express";
import imageModel from "../models/image.js";
import {
  getImageById,
  addImage,
  updateImageById,
} from "../services/image-services.js";
const router = express.Router();

/* This function gets an image based on its object id */
router.get("/:id", async (req, res) => {
  const id = req.params["id"];
  let result = await getImageById(id);
  if (result == undefined || result.length == 0) {
    res.status(404).send("Resource not found.");
  } else {
    res.status(200).send(result);
  }
});

/* This function adds image to image collection */
router.post("/", async (req, res) => {
  const image = new imageModel(req.body);
  let result = await addImage(image);
  if (result === undefined) {
    res.status(500).send("An error occurred in the server.");
  } else {
    res.status(201).send(image);
  }
});

router.put("/:id", async (req, res) => {
  const id = req.params["id"];
  const result = await updateImageById(id, req.body);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.status(204).end();
  }
});

export default router;
