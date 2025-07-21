setUpUI();

const baseURL = "https://tarmeezacademy.com/api/v1";

axios.get(baseURL + "/posts?limit=30").then((response) => {
  const posts = response.data.data;
  document.getElementById("posts").innerHTML = "";

  for (const post of posts) {
    const author = post.author;
    let postTitle = "";
    if (post.title != null) {
      postTitle = post.title;
    }
    let content = `
      <div class="card shadow rounded" style="margin-top: 30px">
        <div class="card-header">
          <img
            src="${author.profile_image}"
            alt="Profile Image"
            class="rounded-circle border border-2"
            style="width: 40px; height: 40px"
          />
          <b>${author.username}</b>
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
    document.getElementById("posts").innerHTML += content;
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
  }
});

function login() {
  const username = document.getElementById("recipient-name").value;
  const password = document.getElementById("message-text").value;
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
  const url = baseURL + "/register";
  const params = {
    name: name,
    username: username,
    password: password,
  };
  axios
    .post(url, params)
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

function setUpUI() {
  const token = localStorage.getItem("token");
  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  if (token == null) {
    loginBtn.style.display = "block";
    registerBtn.style.display = "block";
    logoutBtn.style.display = "none";
  } else {
    loginBtn.style.display = "none";
    registerBtn.style.display = "none";
    logoutBtn.style.display = "block";
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

function showLogoutMessage(message) {
  const alertPlaceholder = document.getElementById("logoutAlert");
  alertPlaceholder.style.display = "block";
  alertPlaceholder.innerHTML = `<span style='display:inline-block; vertical-align:middle;'><svg width='24' height='24' fill='#1976d2' style='margin-right:8px;vertical-align:middle;' viewBox='0 0 24 24'><path d='M16 13v-2H7V8l-5 4 5 4v-3zM20 3h-8v2h8v14h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z'/></svg></span><span style='vertical-align:middle;'>${message}</span>`;
  setTimeout(() => {
    alertPlaceholder.style.display = "none";
    alertPlaceholder.innerHTML = "";
  }, 3000);
}


