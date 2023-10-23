import mongoose from "mongoose";
import userModel from "./user.js";

mongoose
  .connect("mongodb://127.0.0.1:27017/users", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.log(error));

async function getUsers() {
  let result = await userModel.find();
  return result;
}
