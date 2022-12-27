const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const leaderboard = {};

app.get("/users/leader", (req, res) => {
  res.send(leaderboard);
});

app.post("/users/:id/leader", async (req, res) => {
  const userid = req.params.id;
  const user = await axios.get("http://localhost:4001/:userid");
  const { points } = req.body;
  user.points = points;
  leaderboard[points].push(user);
  await axios.post("http://localhost:4001/:userid", user);

  await axios.post("http://localhost:4005/events", {
    type: "LeaderPoints",
    data: user,
  });
});

app.listen(4004, () => {
  console.log("leaders listening at port 4004");
});
