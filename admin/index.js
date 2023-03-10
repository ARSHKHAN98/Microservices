const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const { randomBytes } = require("crypto");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const users = {
  0: {
    id: 0,
    name: "arsh",
    points: "0",
  },
};

app.get("/users", (req, res) => {
  res.send(users);
});

app.get("/users/:id", (req, res) => {
  res.send(users[req.params.id]);
});

app.post("/users/:id", (req, res) => {
  const { id, name, points } = req.body;
  users[id] = { id, name, points };
  // console.log(users[id]);
  res.send(users[id]);
});

app.post("/users", async (req, res) => {
  const id = randomBytes(4).toString("hex");

  const { name } = req.body;

  users[id] = {
    id,
    name,
    points: 0,
  };

  await axios.post("http:/localhost:4000/events", {
    type: "UserCreated",
    data: {
      id,
      name,
      points: 0,
    },
  });

  res.status(201).send(users[id]);
});

app.post("/events", (req, res) => {
  console.log(req.body.type);
  res.send("ok");
});

app.listen(4001, () => {
  console.log("users listening at port 4001");
});
