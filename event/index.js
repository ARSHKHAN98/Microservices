const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post("/events", async (req, res) => {
  const event = req.body;
  await axios.post("http://localhost:4005/events", event).catch((e) => console.log(e.message));
  await axios.post("http://localhost:4002/events", event).catch((e) => console.log(e.message));
  await axios.post("http://localhost:4001/events", event).catch((e) => console.log(e.message));
  await axios.post("http://localhost:4003/events", event).catch((e) => console.log(e.message));
  await axios.post("http://localhost:4004/events", event).catch((e) => console.log(e.message));
  res.send("OK");
});

app.listen(4000, () => {
  console.log("events listening at port 4000");
});
