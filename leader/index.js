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
  const user = await axios.get("http:/localhost:4001/users/" + userid);
  const { points } = req.body;
  user.data.points = points;
  leaderboard[points] = user.data;
  await axios.post("http:/localhost:4001/users/" + userid, user.data).catch((e) => console.log(e.message));
  res.send(leaderboard[points]);

  await axios.post("http://localhost:4000/events", {
    type: "LeaderPoints",
    data: user,
  });
});

app.post("/events", (req, res) => {
  console.log(req.body.type);
  res.send("ok");
});

app.listen(4004, () => {
  console.log("leaders listening at port 4004");
});
