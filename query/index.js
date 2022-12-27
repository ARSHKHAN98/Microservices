const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post("/events", (req, res) => {
  console.log(req.body.type);
  res.send("ok");
});

app.listen(4005, () => {
  console.log("query listening to port 4005");
});
