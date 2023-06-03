import "dotenv/config";
import express from "express";
import "./db";
const app = express();

const PORT = process.env.PORT || 9999;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
