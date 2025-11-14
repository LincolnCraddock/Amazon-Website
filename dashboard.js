// dashboard.js

document.addEventListener("DOMContentLoaded", () => {
  // --- Time-sensitive greeting ---
  const hour = new Date().getHours();
  let greetingText = "Welcome";

  if (hour < 12) greetingText = "Good morning";
  else if (hour < 18) greetingText = "Good afternoon";
  else greetingText = "Good evening";

  document.getElementById(
    "greeting"
  ).textContent = `${greetingText}, ${getUsername()}!`;

  // --- Load user info ---
  const user = JSON.parse(localStorage.getItem("user")) || {
    username: "Guest",
    email: "Not logged in",
    dateJoined: "—",
  };

  document.getElementById("username").textContent = user.username;
  document.getElementById("email").textContent = user.email;
  document.getElementById("date-joined").textContent = user.dateJoined;

  // --- Load order history ---
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const orderList = document.getElementById("order-list");

  if (orders.length === 0) {
    orderList.innerHTML = "<p>No orders yet.</p>";
  } else {
    orders.forEach((order, i) => {
      const div = document.createElement("div");
      div.className = "order-item";
      div.innerHTML = `
          <h3>Order #${i + 1}</h3>
          <p><strong>Date:</strong> ${order.date}</p>
          <p><strong>Items:</strong> ${order.items
            .map((it) => it.title)
            .join(", ")}</p>
          <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
        `;
      orderList.appendChild(div);
    });
  }

  // --- Logout button ---
  document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    alert("Logged out successfully!");
    window.location.href = "index.html";
  });
});

// Helper: get username safely
function getUsername() {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? user.username : "Guest";
}
