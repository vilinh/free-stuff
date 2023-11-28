import imageModel from "../models/image.js";

async function getImageById(id) {
  try {
    return await imageModel.findOne({ _id: id });
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function addImage(image) {
  try {
    return await image.save();
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function updateImageById(id, image) {
  try {
    await imageModel.findByIdAndUpdate(id, image);
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

export { getImageById, addImage, updateImageById };
