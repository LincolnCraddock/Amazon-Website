// handle login
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  const res = await fetch("/login", {
    method: "POST",
    body: new URLSearchParams(formData),
  });

  const data = await res.json().catch(() => {
    document.getElementById("dashboard-button").style.display = "none";
    document.getElementById("login-dropdown").style.display = "";
    document.getElementById("login-error-message").textContent =
      "Failed to log in with that username and password.";
  });

  // check whether loggedIn == true, just in case
  if (data.loggedIn) {
    document.getElementById("dashboard-button").style.display = "";
    document.getElementById("login-dropdown").style.display = "none";
  } else {
    document.getElementById("dashboard-button").style.display = "none";
    document.getElementById("login-dropdown").style.display = "";
    document.getElementById("login-error-message").textContent =
      "Failed to log in with that username and password.";
  }
});
