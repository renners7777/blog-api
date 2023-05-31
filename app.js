const express = require("express");
const mongoose = require("mongoose");

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/blog", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });

// Define a schema for the blog post
const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

// Create a model for the blog post
const BlogPost = mongoose.model("BlogPost", blogPostSchema);

const app = express();
app.use(express.json());

// Create a new blog post
app.post("/posts", (req, res) => {
  const { title, content } = req.body;

  const newPost = new BlogPost({
    title,
    content,
  });

  newPost
    .save()
    .then(() => {
      res.status(201).json({ message: "Post created successfully" });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// Get all blog posts
app.get("/posts", (req, res) => {
  BlogPost.find()
    .then((posts) => {
      res.json(posts);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// Get a specific blog post by ID
app.get("/posts/:id", (req, res) => {
  const postId = req.params.id;

  BlogPost.findById(postId)
    .then((post) => {
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// Update a blog post
app.put("/posts/:id", (req, res) => {
  const postId = req.params.id;
  const { title, content } = req.body;

  BlogPost.findByIdAndUpdate(postId, { title, content })
    .then((post) => {
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json({ message: "Post updated successfully" });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// Delete a blog post
app.delete("/posts/:id", (req, res) => {
  const postId = req.params.id;

  BlogPost.findByIdAndDelete(postId)
    .then((post) => {
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json({ message: "Post deleted successfully" });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
