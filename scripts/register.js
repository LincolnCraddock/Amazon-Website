// handle registration
document
  .getElementById("register-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const res = await fetch("/register", {
      method: "POST",
      body: new URLSearchParams(formData),
    });
    console.log("Response from registering: ", await res.json());
  });
