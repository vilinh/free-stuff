import userModel from "../models/user.js";

async function findUserByUid(uid) {
  try {
    return await userModel.findOne({ uid });
  } catch (error) {
    return undefined;
  }
}

async function removeUserByUid(uid) {
  try {
    let result = await userModel.findOneAndDelete({ uid });
    return result;
  } catch (error) {
    return undefined;
  }
}

async function addUser(user) {
  try {
    return await user.save();
  } catch (error) {
    return undefined;
  }
}

async function updateUserById(id, user) {
  try {
    await userModel.findByIdAndUpdate(id, user);
  } catch (error) {
    return undefined;
  }
}

export { findUserByUid, addUser, removeUserByUid, updateUserById };
