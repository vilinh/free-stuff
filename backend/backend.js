import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 8000;

app.use(express.json());

mongoose.connect(process.env.DATABASE_URL).then(
  () => {
    console.log("Connected to server successfully!");
  }
);