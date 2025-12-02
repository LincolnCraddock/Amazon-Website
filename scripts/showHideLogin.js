window.onload = (async () => {
  const res = await fetch("/auth-status");
  const data = await res.json();
  if (data.loggedIn) {
    document.getElementById("dashboard-button").style.display = "";
    document.getElementById("login-dropdown").style.display = "none";
  } else {
    document.getElementById("dashboard-button").style.display = "none";
    document.getElementById("login-dropdown").style.display = "";
  }
})();
