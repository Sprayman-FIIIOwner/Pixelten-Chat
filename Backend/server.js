// Backend/server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { nanoid } = require("nanoid");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

let messages = [];

// GET messages for a server+channel
app.get("/api/messages", (req, res) => {
  const { serverId, channelId } = req.query;
  if (!serverId || !channelId) return res.json([]);

  // return ordered by createdAt asc
  const out = messages
    .filter(m => m.serverId === serverId && m.channelId === channelId)
    .sort((a,b)=> a.createdAt - b.createdAt);

  res.json(out);
});

// POST new message
app.post("/api/messages", (req, res) => {
  const { userId, username, serverId, channelId, content, parentId } = req.body;
  const newM = {
    id: nanoid(),
    userId: userId || "anon",
    username: username || "anon",
    serverId,
    channelId,
    content,
    parentId: parentId || null,
    reactions: {},
    createdAt: Date.now(),
  };
  messages.push(newM);
  res.json(newM);
});

// PATCH /api/messages/:id/reaction
app.patch("/api/messages/:id/reaction", (req,res)=>{
  const id = req.params.id;
  const { emoji } = req.body;
  const m = messages.find(x=>x.id===id);
  if (!m) return res.status(404).send("not found");
  m.reactions = m.reactions || {};
  m.reactions[emoji] = (m.reactions[emoji]||0) + 1;
  res.json(m);
});

app.listen(PORT, ()=> console.log(`Local backend running on http://localhost:${PORT}`));
