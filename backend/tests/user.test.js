import userModel from "../models/user.js";
import {
  findUserByUid,
  addUser,
  removeUserByUid,
  updateUserById,
} from "../services/user-services.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

beforeAll(async () => {
  await mongoose.connect(process.env.DATABASE_URL).then(() => {
    console.log("Connected to server successfully!");
  });
});

test("test find user by uid", async () => {
  const result = await findUserByUid("nVspFOWRfGbwRdnYu0NP6lJIdEr2");

  expect(result.email).toBe("klvbubble@gmail.com");
  expect(result.id).toBe("653aaebd996a557efdec1ed2");
});

test("test add user", async () => {
  const user = new userModel({
    email: "test@gmail.com",
    uid: "ADSUKXrdEGQZQIEqUdUqIcGII3s2",
  });
  const add = await addUser(user);

  const result = await findUserByUid("ADSUKXrdEGQZQIEqUdUqIcGII3s2");

  // expected = {
  //   uid: "ADSUKXrdEGQZQIEqUdUqIcGII3s2",
  //   email: "test@gmail.com",
  // };

  expect(result.email).toBe("test@gmail.com");
  expect(result.uid).toBe("ADSUKXrdEGQZQIEqUdUqIcGII3s2");
});

test("test update user by id", async () => {
  const user = await findUserByUid("ADSUKXrdEGQZQIEqUdUqIcGII3s2");
  user.email = "newtest@gmail.com";

  const update = await updateUserById(user.uid, user);
  const after_result = await findUserByUid("ADSUKXrdEGQZQIEqUdUqIcGII3s2");

  // expected = {
  //   uid: "ADSUKXrdEGQZQIEqUdUqIcGII3s2",
  //   email: "newtest@gmail.com",
  //   location: {}
  // };

  expect(after_result.email).toBe("newtest@gmail.com");
  expect(after_result.uid).toBe("ADSUKXrdEGQZQIEqUdUqIcGII3s2");
});

test("test remove user by uid", async () => {
  const result = await findUserByUid("ADSUKXrdEGQZQIEqUdUqIcGII3s2");
  console.log("deleteUser result:" + result);
  const del = await removeUserByUid("ADSUKXrdEGQZQIEqUdUqIcGII3s2");

  const after_result = await findUserByUid("ADSUKXrdEGQZQIEqUdUqIcGII3s2");

  expect(after_result).toEqual(null);
});

test("test findUserByUid handles error", async () => {
  await mongoose.connection.close();
  const result = await findUserByUid();

  expect(result).toBe(undefined);
});

test("test removeUserByUid handles error", async () => {
  const result = await removeUserByUid();

  expect(result).toBe(undefined);
});

test("test addUser handles error", async () => {
  const result = await addUser({});

  expect(result).toBe(undefined);
});

test("test updateUserById handles error", async () => {
  const result = await updateUserById(83, null);

  expect(result).toBe(undefined);
});

afterAll(async () => {
  await mongoose.connection.close();
});
