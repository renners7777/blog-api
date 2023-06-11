const express = require("express");
const { MongoClient } = require("mongodb");
const path = require("path");
const app = express();

require("dotenv").config();

const PORT = 8080;
const url = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;
const collectionName = process.env.COLLECTION_NAME;

let db;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  try {
    const collection = db.collection(collectionName);
    const posts = await collection.find().toArray();
    res.render("index", { posts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/posts", async (req, res) => {
  try {
    const { title, content } = req.body;
    const collection = db.collection(collectionName);
    await collection.insertOne({ title, content });
    res.sendStatus(201);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const collection = db.collection(collectionName);
    await collection.updateOne({ _id: id }, { $set: { title, content } });
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const collection = db.collection(collectionName);
    await collection.deleteOne({ _id: id });
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

MongoClient.connect(url, { useUnifiedTopology: true })
  .then((client) => {
    console.log("Connected to MongoDB");
    db = client.db(dbName);
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });
