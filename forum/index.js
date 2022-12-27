const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const forums = {};

app.get("/leader/:id/forums", (req, res) => {
  res.send(forums[req.params.id]);
});

app.get("/leader/forums", (req, res) => {
  res.send(forums);
});

app.post("/leader/:id/forums", async (req, res) => {
  const forumid = randomBytes(4).toString("hex");
  const { data } = req.body;

  const forum = forums[req.params.id];

  forum.push({ id: forumid, data });
  forums[req.params.id] = forum;

  await axios.post("http://localhost:4005/events", {
    type: "ForumCreated",
    data: {
      id: formid,
      data,
      leaderid: req.params.id,
    },
  });

  res.status(201).send(forums);
});

app.listen(4003, () => {
  console.log("forum listening at port 4003");
});
