document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "http://localhost:3000/blogposts";

  const postForm = document.getElementById("postForm");
  const titleInput = document.getElementById("titleInput");
  const contentInput = document.getElementById("contentInput");
  const postsContainer = document.getElementById("postsContainer");

  // Function to create a new blog post
  const createPost = (event) => {
    event.preventDefault();

    const title = titleInput.value;
    const content = contentInput.value;

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        postForm.reset();
        fetchPosts();
      })
      .catch((error) => console.error(error));
  };

  // Function to fetch all blog posts
  const fetchPosts = () => {
    fetch(apiUrl)
      .then((response) => response.json())
      .then((posts) => {
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
      })
      .catch((error) => console.error(error));
  };

  // Function to edit a blog post
  const editPost = (id, title, content) => {
    const newTitle = prompt("Enter a new title:", title);
    const newContent = prompt("Enter new content:", content);

    if (newTitle && newContent) {
      fetch(`${apiUrl}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTitle, content: newContent }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          editPost(id, newTitle, newContent)
          fetchPosts();
        })
        .catch((error) => console.error(error));
    }
  };

  // Function to delete a blog post
  const deletePost = (id) => {
    if (confirm("Are you sure you want to delete this post?")) {
      fetch(`${apiUrl}/${id}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          deletePost(id)
          fetchPosts();
        })
        .catch((error) => console.error(error));
    }
  };

  postForm.addEventListener("submit", createPost);

  fetchPosts();
});
