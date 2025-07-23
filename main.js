const baseURL = "https://tarmeezacademy.com/api/v1";
let currentPage = 1;
let lastPage = 1;

setUpUI();
getPosts(currentPage);



window.addEventListener("scroll", () => {
  const endOfPage = window.innerHeight + window.scrollY >= document.body.offsetHeight - 500;
  if (endOfPage && currentPage < lastPage) {
    currentPage++;
    getPosts(currentPage);
  }
});

function getPosts(page = 1) {
  axios.get(baseURL + "/posts?limit=3&page=" + page).then((response) => {
    const posts = response.data.data;
    lastPage = response.data.meta.last_page;
    // If first page, clear posts. Otherwise, append.
    if (page === 1 && document.getElementById("posts") != null) {
      document.getElementById("posts").innerHTML = "";
    }
    for (const post of posts) {
      const author = post.author;
      let postTitle = "";
      if (post.title != null) {
        postTitle = post.title;
      }
      let user = getCurrentUser();
      let isMyPost = user != null && user.id == author.id;
      let editButtonContent = "";
      let deleteButtonContent = "";
      if (isMyPost) {
        editButtonContent = `
        <button class="btn btn-sm btn-primary ms-2 float-end px-3" onclick="editPost('${encodeURIComponent(JSON.stringify(post))}')">Edit</button>
        `;
        deleteButtonContent = `
        <button class="btn btn-sm btn-danger ms-2 float-end px-3" onclick="deletePost('${encodeURIComponent(JSON.stringify(post))}')">Delete</button>
        `;
      }
      let content = `
      <div class="card shadow rounded" style="margin-top: 30px">
        <div class="card-header">
          <span style="cursor: pointer;" onclick="userClicked(${author.id})">
            <img
            src="${author.profile_image}"
            alt="Profile Image"
            class="rounded-circle border border-2"
            style="width: 40px; height: 40px"
            />
            <b>${author.username}</b>
          </span>
          ${editButtonContent}
          ${deleteButtonContent}
        </div>
        <div class="card-body" onclick="postClicked(${post.id})" style="cursor: pointer;">
          <img src="${post.image}" alt="Post Image" class="w-100" />
          <h6 class="mt-1" style="color: rgb(193, 193, 193)">
            ${post.created_at}
          </h6>
          <h5>${postTitle}</h5>
          <p>${post.body}</p>
          <hr />
          <div style="display: flex; align-items: center;">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-pen"
              viewBox="0 0 16 16"
            >
              <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
            </svg>
            <span style="display: flex; align-items: center;">
              (${post.comments_count}) Comments
              <span style="margin-left: 10px; display: flex; gap: 5px;" id="postTags-${post.id}"></span>
            </span>
          </div>
        </div>
      </div>
    `;

      const postTagsId = document.getElementById(`postTags-${post.id}`);

      for (const tag of post.tags) {
        if (tag.name == null) {
          continue;
        }
        let tagsContent = `
        <button class="btn btn-sm rounded-5" style="background-color: gray; color: white;">
          ${tag.name}
        </button>
      `;
        postTagsId.innerHTML += tagsContent;
      }
      if (document.getElementById("posts") != null) {
        document.getElementById("posts").innerHTML += content;
      }
    }
  });
}

function setUpUI() {
  const token = localStorage.getItem("token");
  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const addPostBtn = document.getElementById("addPostBtn");
  const profileImage = document.getElementById("profileImage");
  const navUsername = document.getElementById("nav-username");
  const user = getCurrentUser();

  if (token == null) {
    loginBtn.style.display = "block";
    registerBtn.style.display = "block";
    logoutBtn.style.display = "none";
    if (addPostBtn != null) {
      addPostBtn.style.display = "none";
    }
    profileImage.style.display = "none";
    navUsername.style.display = "none";
  } else {
    loginBtn.style.display = "none";
    registerBtn.style.display = "none";
    logoutBtn.style.display = "block";
    if (addPostBtn != null) {
      addPostBtn.style.display = "block";
    }
    profileImage.src = user.profile_image;
    navUsername.innerHTML = user.username;
  }

  // Show login success alert after reload
  if (localStorage.getItem("showLoginSuccess") === "true") {
    showSuccessMessage("Login successful!", "success");
    localStorage.removeItem("showLoginSuccess");
  }
  // Show register success alert after reload
  if (localStorage.getItem("showRegisterSuccess") === "true") {
    showSuccessMessage("Registration successful! Welcome!", "success");
    localStorage.removeItem("showRegisterSuccess");
  }
  if (localStorage.getItem("showLogoutAlert") === "true") {
    showLogoutMessage("You have been logged out successfully.");
    localStorage.removeItem("showLogoutAlert");
  }
}

function login() {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;
  const url = baseURL + "/login";
  const params = {
    username: username,
    password: password,
  };
  axios
    .post(url, params)
    .then((response) => {
      const token = response.data.token;
      const user = response.data.user;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      const modal = document.getElementById("loginModal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      localStorage.setItem("showLoginSuccess", "true");
      window.location.reload();
    })
    .catch((error) => {
      showErrorMessage("Login failed! Please check your username and password.");
    });
}

function register() {
  const name = document.getElementById("reg-name").value;
  const username = document.getElementById("reg-username").value;
  const password = document.getElementById("reg-password").value;
  const image = document.getElementById("reg-image").files[0];
  const url = baseURL + "/register";
  let formData = new FormData();
  formData.append("name", name);
  formData.append("username", username);
  formData.append("password", password);
  if (image != null) {
    formData.append("image", image);
  }
  axios
    .post(url, formData)
    .then((response) => {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      const modal = document.getElementById("registerModal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      localStorage.setItem("showRegisterSuccess", "true");
      window.location.reload();
    })
    .catch((error) => {
      showErrorMessage("Registration failed! Please try again.");
    });
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.setItem("showLogoutAlert", "true");
  window.location.reload();
}

function showSuccessMessage(message, type) {
  const alertPlaceholder = document.getElementById("successAlert");
  alertPlaceholder.style.display = "block";
  alertPlaceholder.innerHTML = `<span style='display:inline-block; vertical-align:middle;'><svg width='24' height='24' fill='#1a7f37' style='margin-right:8px;vertical-align:middle;' viewBox='0 0 16 16'><path d='M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM7 11.414l5.707-5.707-1.414-1.414L7 8.586 4.707 6.293 3.293 7.707 7 11.414z'/></svg></span><span style='vertical-align:middle;'>${message}</span>`;
  setTimeout(() => {
    alertPlaceholder.style.display = "none";
    alertPlaceholder.innerHTML = "";
  }, 3000);

}

function showErrorMessage(message) {
  const alertPlaceholder = document.getElementById("errorAlert");
  alertPlaceholder.style.display = "block";
  alertPlaceholder.innerHTML = `<span style='display:inline-block; vertical-align:middle;'><svg width='24' height='24' fill='#d32f2f' style='margin-right:8px;vertical-align:middle;' viewBox='0 0 16 16'><path d='M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1zm0 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm-.93-4.412a.5.5 0 0 1 .854-.354l.646.647.646-.647a.5.5 0 0 1 .708.708l-.647.646.647.646a.5.5 0 0 1-.708.708l-.646-.647-.646.647a.5.5 0 0 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 .708-.708z'/></svg></span><span style='vertical-align:middle;'>${message}</span>`;
  setTimeout(() => {
    alertPlaceholder.style.display = "none";
    alertPlaceholder.innerHTML = "";
  }, 3000);
}


function showLogoutMessage(message) {
  const alertPlaceholder = document.getElementById("logoutAlert");
  alertPlaceholder.style.display = "block";
  alertPlaceholder.innerHTML = `<span style='display:inline-block; vertical-align:middle;'><svg width='24' height='24' fill='#1976d2' style='margin-right:8px;vertical-align:middle;' viewBox='0 0 24 24'><path d='M16 13v-2H7V8l-5 4 5 4v-3zM20 3h-8v2h8v14h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z'/></svg></span><span style='vertical-align:middle;'>${message}</span>`;
  setTimeout(() => {
    alertPlaceholder.style.display = "none";
    alertPlaceholder.innerHTML = "";
  }, 3000);
}

function addPost() {
  const postId = document.getElementById("post-id-input").value;
  let isCreate = postId == null || postId == "";

  const title = document.getElementById("add-post-title").value.trim();
  const body = document.getElementById("add-post-body").value.trim();
  const imageInput = document.getElementById("add-post-image");
  const image = imageInput && imageInput.files.length > 0 ? imageInput.files[0] : null;
  let url = ``;
  let errorMsg = "";
  if (!title) {
    errorMsg += "Title is required. ";
  }
  if (!body) {
    errorMsg += "Body text is required. ";
  }
  if (imageInput && imageInput.required && !image) {
    errorMsg += "Image is required. ";
  }
  if (errorMsg) {
    showErrorMessage(errorMsg.trim());
    return;
  }
  let formData = new FormData();
  formData.append("title", title);
  formData.append("body", body);
  if (image != null) {
    formData.append("image", image);
  }
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${token}`,
  };
  if (isCreate) {
    url = baseURL + "/posts";
    axios
      .post(url, formData, { headers: headers })
      .then((response) => {
        const modal = document.getElementById("addPostModal");
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
        showSuccessMessage("Post created successfully!", "success");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.message) {
          showErrorMessage("Post creation failed: " + error.response.data.message);
        } else if (error.response && error.response.data && error.response.data.errors) {
          // Show validation errors from API
          let apiErrors = error.response.data.errors;
          let details = "";
          if (apiErrors.title) details += "Title: " + apiErrors.title.join(", ") + " ";
          if (apiErrors.body) details += "Body: " + apiErrors.body.join(", ") + " ";
          if (apiErrors.image) details += "Image: " + apiErrors.image.join(", ") + " ";
          showErrorMessage("Post creation failed! " + details.trim());
        } else {
          showErrorMessage("Post creation failed! Please try again.");
        }
      });
  } else {
    url = baseURL + "/posts/" + postId;
    formData.append("_method", "PUT");
    axios
      .post(url, formData, { headers: headers })
      .then((response) => {
        const modal = document.getElementById("addPostModal");
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
        showSuccessMessage("Post Edited successfully!", "success");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.message) {
          showErrorMessage("Post creation failed: " + error.response.data.message);
        } else if (error.response && error.response.data && error.response.data.errors) {
          // Show validation errors from API
          let apiErrors = error.response.data.errors;
          let details = "";
          if (apiErrors.title) details += "Title: " + apiErrors.title.join(", ") + " ";
          if (apiErrors.body) details += "Body: " + apiErrors.body.join(", ") + " ";
          if (apiErrors.image) details += "Image: " + apiErrors.image.join(", ") + " ";
          showErrorMessage("Post Editing failed! " + details.trim());
        } else {
          showErrorMessage("Post Editing failed! Please try again.");
        }
      });
  }
}

function getCurrentUser() {
  let user = null;
  const storageUser = localStorage.getItem("user");
  if (storageUser != null) {
    user = JSON.parse(storageUser);
  }
  return user;
}

function postClicked(postId) {
  window.location.href = `postDetails.html?id=${postId}`;
}

const serchParams = new URLSearchParams(window.location.search);
const postId = serchParams.get("id");
if (postId != null) {
  getPostDetails(postId);
}

function getPostDetails(postId) {
  const url = baseURL + "/posts/" + postId;
  const postTitleElement = document.getElementById("postDetailsUsername");
  axios.get(url).then((response) => {
    const post = response.data.data;
    const author = post.author;
    const comments = post.comments;
    let postTitle = "";
    if (post.title != null) {
      postTitle = post.title;
      postTitleElement.innerHTML = author.username;
    }
    let commentsContent = ``;
    let user = getCurrentUser();
    let isMyPost = user != null && user.id == author.id;
    let editButtonContent = "";
    let deleteButtonContent = "";
    if (isMyPost) {
      editButtonContent = `
        <button class="btn btn-sm btn-primary ms-2 float-end px-3" onclick="editPost('${encodeURIComponent(JSON.stringify(post))}')">Edit</button>
        `;
      deleteButtonContent = `
        <button class="btn btn-sm btn-danger ms-2 float-end px-3" onclick="deletePost('${encodeURIComponent(JSON.stringify(post))}')">Delete</button>
        `;
    }
    for (const comment of comments) {
      commentsContent += `
      <div class="p-3" style="background-color: rgb(187, 187, 187);">
        <div class="d-flex align-items-center">
          <img
            src="${comment.author.profile_image}"
            alt="Profile Image"
            class="rounded-circle border border-2"
            style="width: 40px; height: 40px"
          />
          <b class="ms-2">${comment.author.username}</b>
        </div>

        <div>
          ${comment.body}
        </div>
      </div>
    `;
    }
    let content = `
    <div class="card shadow rounded">
      <div class="card-header">
        <span style="cursor: pointer;" onclick="userClicked(${author.id})">
          <img
          src="${author.profile_image}"
          alt="Profile Image"
          class="rounded-circle border border-2"
          style="width: 40px; height: 40px"
          />
          <b>${author.username}</b>
        </span>
        ${editButtonContent}
        ${deleteButtonContent}
      </div>
      <div class="card-body">
        <img src="${post.image}" alt="Post Image" class="w-100" />
        <h6 class="mt-1" style="color: rgb(193, 193, 193)">
          ${post.created_at}
        </h6>
        <h5>${postTitle}</h5>
        <p>${post.body}</p>
        <hr />
        <div style="display: flex; align-items: center;">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-pen"
            viewBox="0 0 16 16"
          >
            <path
              d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"
            />
          </svg>
          <span style="display: flex; align-items: center;">
            (${post.comments_count}) Comments
            <span style="margin-left: 10px; display: flex; gap: 5px;" id="postTags-${post.id}"></span>
          </span>
        </div>
      </div>

      <div id="comments">
        ${commentsContent}
      </div>

      <div class="card-footer">
        <form id="commentForm">
          <div class="input-group">
            <input type="text" class="form-control" id="commentBody" placeholder="Write a comment..." />
            <button type="button" class="btn btn-primary" onclick="addComment(${post.id})">Send</button>
          </div>
        </form>
      </div>
    </div>
  `;
    document.getElementById("postDetails").innerHTML = content;
  });
}

function addComment(postId) {
  const commentBody = document.getElementById("commentBody").value.trim();
  if (!commentBody) {
    showErrorMessage("Comment is required.");
    return;
  }
  const url = baseURL + "/posts/" + postId + "/comments";
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const body = {
    body: commentBody,
  };
  axios
    .post(url, body, { headers: headers })
    .then((response) => {
      getPostDetails(postId);
      showSuccessMessage("Comment added successfully!", "success");
    })
    .catch((error) => {
      if (error.response && error.response.data && error.response.data.message) {
        showErrorMessage("Comment creation failed: " + error.response.data.message);
      } else if (error.response && error.response.data && error.response.data.errors) {
        // Show validation errors from API
        let apiErrors = error.response.data.errors;
        let details = "";
        if (apiErrors.body) details += "Body: " + apiErrors.body.join(", ") + " ";
        showErrorMessage("Comment creation failed! " + details.trim());
      } else {
        showErrorMessage("Comment creation failed! Please try again.");
      }
    });
}

function editPost(post) {
  const postData = JSON.parse(decodeURIComponent(post));
  document.getElementById("post-id-input").value = postData.id;
  document.getElementById("add-post-title").value = postData.title;
  document.getElementById("add-post-body").value = postData.body;
  document.getElementById("add-post-btn").innerHTML = "Update";
  document.getElementById("add-post").innerHTML = "Edit Post";
  let postModal = new bootstrap.Modal(document.getElementById("addPostModal"), {});
  postModal.toggle();
}

function deletePost(post) {
  const postData = JSON.parse(decodeURIComponent(post));
  let deletePostModal = new bootstrap.Modal(document.getElementById("deletePostModal"), {});
  deletePostModal.toggle();
  document.getElementById("delete-post-name").innerHTML = postData.title;
  document.getElementById("post-id-input").value = postData.id;
}

function confirmDeletePost() {
  const postId = document.getElementById("post-id-input").value;
  const url = baseURL + "/posts/" + postId;
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  axios
    .delete(url, { headers: headers })
    .then((response) => {
      showSuccessMessage("Post deleted successfully!", "success");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    })
    .catch((error) => {
      showErrorMessage("Post deletion failed! Please try again.");
    });
}

function goToProfile() {
  window.location.href = "./profile.html";
}


function getUserFromId() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("user");
  if (id == null) {
    return;
  }
  axios.get(baseURL + "/users/" + id).then((response) => {
    const user = response.data.data;
    if (user.email != null) {
      document.getElementById("main-info-email").innerHTML = user.email;
    }
    document.getElementById("main-info-name").innerHTML = user.name;
    document.getElementById("main-info-username").innerHTML = user.username;
    document.getElementById("main-info-posts-count").innerHTML = user.posts_count;
    document.getElementById("main-info-comments-count").innerHTML = user.comments_count;
    document.getElementById("main-info-page-username").innerHTML = user.username;
    const profileImgElem = document.getElementById("main-info-profile-image");
    if (user.profile_image == null) {
      profileImgElem.src = "assets/profile-user.png";
    } else {
      profileImgElem.src = user.profile_image;
      profileImgElem.onerror = function() {
        this.onerror = null; // Prevent infinite loop
        this.src = "assets/profile-user.png";
      };
    }
  });
}

function getUserPosts() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("user");
  if (id == null) {
    return;
  }
  axios.get(baseURL + "/users/" + id + "/posts").then((response) => {
    const posts = response.data.data;
    for (const post of posts) {
      const author = post.author;
      let postTitle = "";
      if (post.title != null) {
        postTitle = post.title;
      }
      let user = getCurrentUser();
      let isMyPost = user != null && user.id == author.id;
      let editButtonContent = "";
      let deleteButtonContent = "";
      if (isMyPost) {
        editButtonContent = `
        <button class="btn btn-sm btn-primary ms-2 float-end px-3" onclick="editPost('${encodeURIComponent(JSON.stringify(post))}')">Edit</button>
        `;
        deleteButtonContent = `
        <button class="btn btn-sm btn-danger ms-2 float-end px-3" onclick="deletePost('${encodeURIComponent(JSON.stringify(post))}')">Delete</button>
        `;
      }
      let content = `
      <div class="card shadow rounded" style="margin-top: 30px">
        <div class="card-header">
          <span style="cursor: pointer;" onclick="userClicked(${author.id})">
            <img
            src="${author.profile_image}"
            alt="Profile Image"
            class="rounded-circle border border-2"
            style="width: 40px; height: 40px"
            />
            <b>${author.username}</b>
          </span>
          ${editButtonContent}
          ${deleteButtonContent}
        </div>
        <div class="card-body" onclick="postClicked(${post.id})" style="cursor: pointer;">
          <img src="${post.image}" alt="Post Image" class="w-100" />
          <h6 class="mt-1" style="color: rgb(193, 193, 193)">
            ${post.created_at}
          </h6>
          <h5>${postTitle}</h5>
          <p>${post.body}</p>
          <hr />
          <div style="display: flex; align-items: center;">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-pen"
              viewBox="0 0 16 16"
            >
              <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
            </svg>
            <span style="display: flex; align-items: center;">
              (${post.comments_count}) Comments
              <span style="margin-left: 10px; display: flex; gap: 5px;" id="userPostTags-${post.id}"></span>
            </span>
          </div>
        </div>
      </div>
    `;

      const postTagsId = document.getElementById(`userPostTags-${post.id}`);
      if (postTagsId) {
        for (const tag of post.tags) {
          if (tag.name == null) continue;
          let tagsContent = `
            <button class="btn btn-sm rounded-5" style="background-color: gray; color: white;">
              ${tag.name}
            </button>
          `;
          postTagsId.innerHTML += tagsContent;
        }
      }
      if (document.getElementById("userPosts") != null) {
        document.getElementById("userPosts").innerHTML += content;
      }
    }
  });
}


function userClicked(userId) {
  window.location.href = "./profile.html?user=" + userId;
}


function gotomyprofile() {
  const user = getCurrentUser();
  if (user == null) {
    return;
  }
  window.location.href = "./profile.html?user=" + user.id;
}
