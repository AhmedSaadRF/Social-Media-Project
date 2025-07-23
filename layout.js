setUI();

function setUI() {
  document.getElementById("loginModal").innerHTML = `
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Login</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form>
          <div class="mb-3">
            <label for="login-username" class="col-form-label">Username:</label>
            <input type="text" class="form-control" id="login-username" value="">
          </div>
          <div class="mb-3">
            <label for="login-password" class="col-form-label">Password:</label>
            <input type="password" class="form-control" id="login-password" value="">
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" onclick="login()">Login</button>
      </div>
    </div>
  </div>
`

  document.getElementById("registerModal").innerHTML = `
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Register</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form>
          <div class="mb-3">
            <label for="reg-image" class="col-form-label">Profile Image:</label>
            <input type="file" class="form-control" id="reg-image">
          </div>
          <div class="mb-3">
            <label for="reg-name" class="col-form-label">Name:</label>
            <input type="text" class="form-control" id="reg-name">
          </div>
          <div class="mb-3">
            <label for="reg-username" class="col-form-label">Username:</label>
            <input type="text" class="form-control" id="reg-username">
          </div>
          <div class="mb-3">
            <label for="reg-password" class="col-form-label">Password:</label>
            <input type="password" class="form-control" id="reg-password">
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" onclick="register()">Register</button>
      </div>
    </div>
  </div>
`

  document.getElementById("addPostModal").innerHTML = `
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="add-post">Add Post</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form>
          <div class="mb-3">
            <label for="add-post-title" class="col-form-label">Title</label>
            <input type="text" class="form-control" id="add-post-title">
            <input type="hidden" id="post-id-input" value="">
          </div>
          <div class="mb-3">
            <textarea name="" id="add-post-body" style="width: 100%; height: 100px; border-color: gray; border-radius: 10px; resize: none;"></textarea>
          </div>
          <div class="mb-3">
            <label for="add-post-image" class="col-form-label">Image</label>
            <input type="file" class="form-control" id="add-post-image">
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" id="add-post-btn" onclick="addPost()">Create</button>
      </div>
    </div>
  </div>
`

  document.getElementById("deletePostModal").innerHTML = `
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="add-post">Are you sure you want to delete this post? 
          <span id="delete-post-name"></span></h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-danger" id="add-post-btn" onclick="confirmDeletePost()">Delete</button>
      </div>
    </div>
  </div>
`
  function getCurrentUser() {
    let user = null;
    const storageUser = localStorage.getItem("user");
    if (storageUser != null) {
      user = JSON.parse(storageUser);
    }
    return user;
  }
  const user = getCurrentUser();
  document.getElementById("navbarContainer").innerHTML = `
  <div class="d-flex justify-content-center">
    <div class="col-9">
      <nav class="navbar navbar-expand-lg bg-light shadow rounded pt-3">
        <div class="container-fluid">
          <a class="navbar-brand" href="./index.html">RFRF</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="./index.html">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="./profile.html?user=${user ? user.id : ''}">Profile</a>
              </li>
            </ul>

            <!-- Login, Register and Logout Buttons -->
            <div class="d-flex w-100 justify-content-end">
              <button id="loginBtn" type="button" class="btn btn-outline-success mx-2" data-bs-toggle="modal"
                data-bs-target="#loginModal">
                Login
              </button>
              <button id="registerBtn" type="button" class="btn btn-outline-success" data-bs-toggle="modal"
                data-bs-target="#registerModal">
                Register
              </button>
              <!-- Logout Button -->
                <div class="d-flex align-items-center" style="gap: 10px;">
                <img src="./assets/profile.png" id="profileImage" onclick="gotomyprofile()" alt="Profile Image" class="rounded-circle border border-2" style="width: 40px; height: 40px; cursor: pointer;">
                <b id="nav-username" onclick="gotomyprofile()" style="cursor: pointer;">Ahmed_RFRF</b>
                <button onclick="logout()" id="logoutBtn" type="button" class="btn btn-outline-danger mx-2">
                  Logout
                </button>
              </div>
              <!-- Logout Button -->
            </div>
            <!-- Login, Register and Logout Buttons -->
          </div>
        </div>
      </nav>
    </div>
  </div>
`
  document.getElementById("profileMainContainer").innerHTML = `
    <div class="d-flex justify-content-center mt-5">
      <div class="col-9">
        <!-- Profile -->
        <div class="card shadow rounded">
          <div class="card-body">
            <div class="row">
              <div class="col-2">
                <img id="main-info-profile-image" src="./assets/profile-user.png" alt="Profile Image"
                  style="width: 120px; height: 120px; border-radius: 50%;">
              </div>

              <div id="main-info" class="col-4 d-flex flex-column justify-content-evenly" style="font-weight: 900;">
                <div id="main-info-email" style="font-weight: 500; font-size: 20px;">example@gmail.com</div>
                <div id="main-info-name" style="font-weight: 500; font-size: 20px;">Ahmed</div>
                <div id="main-info-username" style="font-weight: 500; font-size: 20px;">Ahmed_RFRF</div>
              </div>

              <div class="col-4 d-flex flex-column justify-content-evenly">
                <div style="color: rgb(172, 172, 172); font-weight: 100;">
                  <span style="font-size: 50px; color: black;" id="main-info-posts-count">13</span> Posts
                </div>
                <div style="color: rgb(172, 172, 172); font-weight: 100;">
                  <span style="font-size: 50px; color: black;" id="main-info-comments-count">20</span> Coments
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Profile -->

        <!-- User -->
        <div class="row mt-5">
          <h1><span id="main-info-page-username">RFRF</span> Posts</h1>
        </div>
        <!-- User -->

        <!-- Posts -->
        <div class="row" id="userPosts">
        </div>
        <!-- Posts -->
      </div>
    </div>
  `;
}
