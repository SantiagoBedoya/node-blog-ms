const { randomBytes } = require("crypto");
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  return res.status(200).json(posts);
});

app.post("/posts/create", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;
  posts[id] = {
    id,
    title,
  };

  try {
    await axios.post("http://event-bus-srv:4005/events", {
      type: "PostCreated",
      data: { id, title },
    });
  } catch (error) {
    console.log(`something went wrong: ${error.message}`);
  }

  return res.status(201).json(posts[id]);
});

app.post("/events", (req, res) => {
  console.log("Received event", req.body.type);

  return res.sendStatus(204);
});

app.listen(4000, () => {
  console.log("v2");
  console.log("Listening on 4000");
});
