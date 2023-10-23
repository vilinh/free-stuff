import express from "express";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());