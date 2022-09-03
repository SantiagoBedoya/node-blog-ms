const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }
  if (type === "CommentCreated") {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    post.comments.push({ id, content, status });
  }
  if (type === "CommentUpdated") {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    const comment = post.comments.find((comment) => comment.id === id);

    comment.status = status;
    comment.content = content;
  }
};

app.get("/posts", (req, res) => {
  return res.json(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  handleEvent(type, data);

  return res.sendStatus(204);
});

app.listen(4002, async () => {
  console.log("Listening on 4002");
  try {
    const resp = await axios.get("http://event-bus-srv:4005/events");
    for (let event of resp.data) {
      console.log(`processing event: ${event.type}`);
      handleEvent(event.type, event.data);
    }
  } catch (error) {
    console.log(`something went wrong: ${error.message}`);
  }
});
