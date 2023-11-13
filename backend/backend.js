import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import listing from "./routes/listing.js";
import user from "./routes/user.js";
import image from "./routes/image.js";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());

app.use("/listing", listing);
app.use("/user", user);
app.use("/image", image);

app.get("/", (req, res) => {
  res.send("Backend!");
});

mongoose.connect(process.env.DATABASE_URL).then(() => {
  console.log("Connected to server successfully!");
});

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
