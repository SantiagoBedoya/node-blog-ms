const { randomBytes } = require("crypto");
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.status(200).json(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;
  const comments = commentsByPostId[req.params.id] || [];
  comments.push({ id: commentId, content, status: "pending" });
  commentsByPostId[req.params.id] = comments;

  await axios.post("http://event-bus-srv:4005/events", {
    type: "CommentCreated",
    data: {
      id: commentId,
      postId: req.params.id,
      content,
      status: "pending",
    },
  });

  return res.status(201).json(comments);
});

app.post("/events", async (req, res) => {
  console.log("Received event", req.body.type);
  const { type, data } = req.body;
  if (type === "CommentModerated") {
    const { postId, id, status, content } = data;
    const comments = commentsByPostId[postId];
    const comment = comments.find((comment) => comment.id === id);
    comment.status = status;

    try {
      await axios.post("http://event-bus-srv:4005/events", {
        type: "CommentUpdated",
        data: {
          id,
          postId,
          status,
          content,
        },
      });
    } catch (error) {
      console.log(`something went wrong: ${error.message}`);
    }
  }
  return res.sendStatus(204);
});

app.listen(4001, () => {
  console.log("Listening on port 4001");
});
