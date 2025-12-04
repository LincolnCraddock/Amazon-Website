// handle registration
document
  .getElementById("register-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const res1 = await fetch("/register", {
      method: "POST",
      body: new URLSearchParams(formData),
    });

    const res2 = await fetch("/login", {
      method: "POST",
      body: new URLSearchParams(formData),
    });

    const data = await res2.json();
    if (data.loggedIn) {
      document.getElementById("dashboard-button").style.display = "";
      document.getElementById("login-dropdown").style.display = "none";
    } else {
      document.getElementById("dashboard-button").style.display = "none";
      document.getElementById("login-dropdown").style.display = "";
    }
  });
