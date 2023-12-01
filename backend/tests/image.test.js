import imageModel from "../models/image.js";
import {
  getImageById,
  addImage,
  updateImageById,
} from "../services/image-services.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

beforeAll(async () => {
  await mongoose.connect(process.env.DATABASE_URL).then(() => {
    console.log("Connected to server successfully!");
  });
});

test("test get image by id", async () => {
  const result = await getImageById("654d2674124e992f8ebba99b");

  // expected = {
  //   _id: ObjectId("654d2674124e992f8ebba99b"),
  //   name: "brokeblessings.png"
  // };

  expect(result.name).toBe("brokeblessings.png");
});

test("test add image", async () => {
  const image = new imageModel({
    name: "testImage.png",
    base64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA1MAAAHNC",
  });
  await addImage(image);

  const result = await getImageById(image.id);

  expect(result.name).toBe("testImage.png");
  await imageModel.findByIdAndDelete(image.id);
});

test("test update image by id", async () => {
  const image = new imageModel({
    name: "testImage.png",
    base64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA1MAAAHNC",
  });
  await addImage(image);
  image.name = "newTestImage.png";

  await updateImageById(image.id, image);
  const after_result = await getImageById(image.id);

  expect(after_result.name).toBe("newTestImage.png");
  await imageModel.findByIdAndDelete(image.id);
});

test("test getImageById handles error", async () => {
  const result = await getImageById(83);

  expect(result).toBe(undefined);
});

test("test updateImageById handles error", async () => {
  const result = await updateImageById(83, null);

  expect(result).toBe(undefined);
});

test("test addImage handles error", async () => {
  const result = await addImage({});

  expect(result).toBe(undefined);
});

afterAll(async () => {
  await mongoose.connection.close();
});
