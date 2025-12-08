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

    const data1 = await res1.json().catch(() => {
      document.getElementById("register-error-message").textContent =
        "Failed to register a user with that username and email.";
    });
    if (data1.registered) {
      const res2 = await fetch("/login", {
        method: "POST",
        body: new URLSearchParams(formData),
      });

      const data2 = await res2.json().catch(() => {
        document.getElementById("dashboard-button").style.display = "none";
        document.getElementById("login-dropdown").style.display = "";
        document.getElementById("login-error-message").textContent =
          "Failed to log in with the user you just registered.";
      });
      document.getElementById("register-error-message").textContent = "";

      // check whether loggedIn == true, just in case
      if (data2.loggedIn) {
        document.getElementById("dashboard-button").style.display = "";
        document.getElementById("login-dropdown").style.display = "none";
        document.getElementById("login-error-message").textContent = "";
      } else {
        document.getElementById("dashboard-button").style.display = "none";
        document.getElementById("login-dropdown").style.display = "";
        document.getElementById("login-error-message").textContent =
          "Failed to log in with the user you just registered.";
      }
    } else {
      document.getElementById("register-error-message").textContent =
        "Failed to register a user with that username and email.";
    }
  });
