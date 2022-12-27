const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const { randomBytes } = require("crypto");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const forums = {};

app.get("/users/:id/forums", (req, res) => {
  res.send(forums[req.params.id]);
});

app.get("/users/forums", (req, res) => {
  res.send(forums);
});

app.post("/users/:id/forums", async (req, res) => {
  const forumid = randomBytes(4).toString("hex");
  const { data } = req.body;

  const forum = forums[req.params.id] || [];

  forum.push({ id: forumid, data });
  forums[req.params.id] = forum;

  await axios.post("http://localhost:4000/events", {
    type: "ForumCreated",
    data: {
      id: forumid,
      data,
      leaderid: req.params.id,
    },
  });

  res.status(201).send(forums);
});

app.post("/events", (req, res) => {
  console.log(req.body.type);
  res.send("ok");
});

app.listen(4003, () => {
  console.log("forum listening at port 4003");
});
