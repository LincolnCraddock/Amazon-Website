document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  try {
    const res = await fetch("/login", {
      method: "POST",
      body: new URLSearchParams(formData),
    });

    // If server returns non-2xx status, treat it as an error
    if (!res.ok) throw new Error("Bad response from server");

    const data = await res.json();

    if (data.loggedIn) {
      document.getElementById("dashboard-button").style.display = "";
      document.getElementById("login-dropdown").style.display = "none";
      return;
    }
  } catch (err) {
    // You can log for debugging:
    console.error("Login error:", err);
  }

  // Fallback for ANY failure (bad login, parse error, network error)
  document.getElementById("dashboard-button").style.display = "none";
  document.getElementById("login-dropdown").style.display = "";
  document.getElementById("login-error-message").textContent =
    "Failed to log in with that username and password.";
});
