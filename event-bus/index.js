const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const events = [];

app.post("/events", async (req, res) => {
  const event = req.body;

  events.push(event);

  console.log(`SENDING: ${JSON.stringify(event)}`);

  try {
    const resp = await Promise.all([
      axios.post("http://posts-srv:4000/events", event),
      axios.post("http://comments-srv:4001/events", event),
      axios.post("http://query-srv:4002/events", event),
      axios.post("http://moderation-srv:4003/events", event),
    ]);
  } catch (error) {
    console.log(`something went wrong: ${error.message}`);
  }

  return res.status(200).json({ status: "OK" });
});

app.get("/events", (req, res) => {
  return res.json(events);
});

app.listen(4005, () => {
  console.log("Listening on 4005  [event-bus]");
});
