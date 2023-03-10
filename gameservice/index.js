const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.set("strictQuery", false);
mongoose
  .connect("mongodb+srv://arshkhan98:arshkhan98@cluster0.ryq4vz9.mongodb.net/test", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("SUCCESS"))
  .catch((error) => console.log(error.message));

const platforms = {};
const games = {};
const levels = {};

app.get("/users/platforms", (req, res) => {
  res.send(platforms);
});

app.post("/users/platforms", async (req, res) => {
  const platformid = randomBytes(4).toString("hex");
  const { data } = req.body;
  platforms[platformid] = { id: platformid, data };
  await axios.post("http://localhost:4000/events", {
    type: "PlatformCreated",
    data: {
      id: platformid,
      data,
    },
  });
  res.send(platforms[platformid]);
});

app.delete("/users/platforms", (req, res) => {});

app.get("/users/:platformid/games", (req, res) => {
  res.send(games[req.params.platformid]);
});

app.post("/users/:platformid/games", async (req, res) => {
  const gameid = randomBytes(4).toString("hex");
  const { data } = req.body;

  const game = games[req.params.platformid] || [];
  game.push({ id: gameid, data });
  games[req.params.platformid] = game;
  await axios.post("http://localhost:4000/events", {
    type: "GameCreated",
    data: {
      id: gameid,
      platformid: req.params.platformid,
      data,
    },
  });
  res.send(games[req.params.platformid]);
});

app.delete("/users/:platformid/games", (req, res) => {});

app.get("/users/:platformid/:gameid/level", (req, res) => {
  res.send(levels[req.params.platformid][req.params.gameid]);
});

app.post("/users/:gameid/level", async (req, res) => {
  const lvlid = randomBytes(4).toString("hex");
  const { data } = req.body;

  const level = levels[req.params.gameid] || [];
  level.push({ id: lvlid, data });
  levels[req.params.gameid] = level;
  res.send(levels[req.params.gameid]);

  await axios.post("http://localhost:4000/events", {
    type: "LevelCreated",
    data: {
      id: lvlid,
      gameid: req.params.gameid,
      data,
    },
  });
});

app.delete("/users/:platformid/:gameid/level", (req, res) => {});

app.post("/events", (req, res) => {
  console.log(req.body.type);
  res.send("ok");
});

app.listen(4002, () => {
  console.log("gameservice listening at port 4002");
});
