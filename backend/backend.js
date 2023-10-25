import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import listing from "./routes/listing.js"
import user from "./routes/user.js"

dotenv.config();

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.use('/listing', listing)
app.use('/user', user)

app.get("/", (req, res) => {
    res.send("Backend!");
});
mongoose.connect(process.env.DATABASE_URL).then(
  () => {
    console.log("Connected to server successfully!");
  }
);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
