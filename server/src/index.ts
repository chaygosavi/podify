import "dotenv/config";
import express from "express";
import "./db";
import authRouter from "./routers/auth";
import audioRouter from "./routers/audio";
import favoriteRouter from "./routers/favorite";
import playlistRouter from "./routers/playlist";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("src/public"));

app.use("/auth", authRouter);
app.use("/audio", audioRouter);
app.use("/favorite", favoriteRouter);
app.use("/playlist", playlistRouter);

const PORT = process.env.PORT || 9999;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
