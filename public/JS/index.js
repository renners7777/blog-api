document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "http://localhost:3000/posts";

  const postForm = document.getElementById("postForm");
  const titleInput = document.getElementById("titleInput");
  const contentInput = document.getElementById("contentInput");
  const postsContainer = document.getElementById("postsContainer");

  // Function to create a new blog post
  const createPost = async (event) => {
    event.preventDefault();

    const title = titleInput.value;
    const content = contentInput.value;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        throw new Error("Failed to create post.");
      }

      const data = await response.json();
      console.log(data);
      postForm.reset();
      fetchPosts();
    } catch (error) {
      console.error(error);
    }
  };

  // Function to fetch all blog posts
  const fetchPosts = async () => {
    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch posts.");
      }

      const posts = await response.json();

      postsContainer.innerHTML = "";

      posts.forEach((post) => {
        const postElement = document.createElement("div");
        postElement.className = "post";
        postElement.innerHTML = `
          <h2>${post.title}</h2>
          <p>${post.content}</p>
          <button onclick="editPost('${post._id}', '${post.title}', '${post.content}')">Edit</button>
          <button onclick="deletePost('${post._id}')">Delete</button>
        `;
        postsContainer.appendChild(postElement);
      });
    } catch (error) {
      console.error(error);
    }
  };

  // Function to edit a blog post
  const editPost = async (id, title, content) => {
    const newTitle = prompt("Enter a new title:", title);
    const newContent = prompt("Enter new content:", content);

    if (newTitle && newContent) {
      try {
        const response = await fetch(`${apiUrl}/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: newTitle, content: newContent }),
        });

        if (!response.ok) {
          throw new Error("Failed to update post.");
        }

        const data = await response.json();
        console.log(data);
        fetchPosts();
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Function to delete a blog post
  const deletePost = async (id) => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        const response = await fetch(`${apiUrl}/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete post.");
        }

        const data = await response.json();
        console.log(data);
        fetchPosts();
      } catch (error) {
        console.error(error);
      }
    }
  };

  postForm.addEventListener("submit", createPost);

  fetchPosts();
});
