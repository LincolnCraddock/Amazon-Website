const res = await fetch("/auth-status");
const data = await res.json();
if (data.loggedIn) {
  document.getElementById("dashboard-button").display = "";
  document.getElementById("login-dropdown").display = "none";
} else {
  document.getElementById("dashboard-button").display = "none";
  document.getElementById("login-dropdown").display = "";
}
