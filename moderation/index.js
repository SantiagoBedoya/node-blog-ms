const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  if (type === "CommentCreated") {
    const status = data.content.includes("orange") ? "rejected" : "approved";
    try {
      await axios.post("http://event-bus-srv:4005/events", {
        type: "CommentModerated",
        data: {
          id: data.id,
          postId: data.postId,
          status,
          content: data.content,
        },
      });
    } catch (error) {
      console.log(`something went wrong: ${error.message}`);
    }
  }

  return res.sendStatus(204);
});

app.listen(4003, () => {
  console.log("Listening on 4003");
});
