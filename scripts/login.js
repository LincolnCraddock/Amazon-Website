// handle login
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  const res = await fetch("/login", {
    method: "POST",
    body: new URLSearchParams(formData),
  });
  console.log("Response from logging in: ", await res.json());
});
