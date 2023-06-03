const express = require("express");
const { MongoClient } = require("mongodb");
const path = require("path");

const url = "mongodb://localhost:27017";
const dbName = "blog";

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Connect to MongoDB
let db;
MongoClient.connect(url, { useUnifiedTopology: true })
  .then((client) => {
    console.log("Connected to MongoDB");
    db = client.db(dbName);
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });

// Create a new blog post
app.post('/posts', (req, res) => {
  const { title, content } = req.body;

  const collection = db.collection('blogposts');
  collection.insertOne({ title, content })
    .then(() => {
      res.status(201).json({ message: 'Post created successfully' });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
     res.redirect('/');
});

// Get all blog posts
app.get("/", (req, res) => {
  const collection = db.collection("blogposts");
  collection
    .find()
    .toArray()
    .then((post) => {
      res.render("index", { post });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// Get a specific blog post by ID
app.get('/posts/:id', (req, res) => {
  const postId = req.params.id;

  const collection = db.collection('blogposts');
  collection.findOne({ _id: postId })
    .then((post) => {
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.json(post);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// Update a blog post
app.put('/posts/:id', (req, res) => {
  const postId = req.params.id;
  const { title, content } = req.body;

  const collection = db.collection('blogposts');
  collection.updateOne({ _id: postId }, { $set: { title, content } })
    .then((result) => {
      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.json({ message: 'Post updated successfully' });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// Delete a blog post
app.delete('/posts/:id', (req, res) => {
  const postId = req.params.id;

  const collection = db.collection('blogposts');
  collection.deleteOne({ _id: postId })
    .then((result) => {
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.json({ message: 'Post deleted successfully' });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
