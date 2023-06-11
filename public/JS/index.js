document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "http://localhost:3000/posts";

  const postForm = document.getElementById("postForm");
  const titleInput = document.getElementById("titleInput");
  const contentInput = document.getElementById("contentInput");
  const postsContainer = document.getElementById("postsContainer");

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

      if (response.ok) {
        titleInput.value = "";
        contentInput.value = "";
        fetchPosts();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch(apiUrl);
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

        if (response.ok) {
          fetchPosts();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const deletePost = async (id) => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        const response = await fetch(`${apiUrl}/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          fetchPosts();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  postForm.addEventListener("submit", createPost);

  fetchPosts();
});
