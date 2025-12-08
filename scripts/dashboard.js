// dashboard.js

document.addEventListener("DOMContentLoaded", () => {
  // --- Load user info ---
  let user;
  fetch("/auth-status").then((res) => {
    res.json().then(async (data) => {
      if (data.loggedIn) {
        user = {
          username: data.user.name,
          email: data.user.email,
          dateJoined: data.user.created,
        };
      } else {
        user = {
          username: "Guest",
          email: "Not logged in",
          dateJoined: "—",
        };
      }

      // --- Time-sensitive greeting ---
      const hour = new Date().getHours();
      let greetingText = "Welcome";

      if (hour < 12) greetingText = "Good morning";
      else if (hour < 18) greetingText = "Good afternoon";
      else greetingText = "Good evening";

      document.getElementById(
        "greeting"
      ).textContent = `${greetingText}, ${user.username}!`;

      document.getElementById("username").textContent = user.username;
      document.getElementById("email").textContent = user.email;
      document.getElementById("date-joined").textContent = new Date(
        user.dateJoined
      ).toUTCString();

      // --- Load order history ---
      // const orders = JSON.parse(localStorage.getItem("orders")) || [];
      const response = await fetch("/my-orders");
      const orders = await response.json();

      const orderList = document.getElementById("order-list");

      if (orders.length === 0) {
        orderList.innerHTML = "<p>No orders yet.</p>";
      } else {
        orders.forEach((order, i) => {
          console.log(order);
          const div = document.createElement("div");
          div.className = "order-item";
          div.innerHTML = `
              <h3>Order #${i + 1}</h3>
              <p><strong>Date:</strong> ${new Date(
                order.created
              ).toUTCString()}</p>
              <p><strong>Items:</strong> ${order.items
                .map(function(it) {
                  productsData.items.find()
                })
                .join("<br>")}</p>
              <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
            `;
          orderList.appendChild(div);
        });
      }

      // --- Logout button ---
      document.getElementById("logout-btn").addEventListener("click", () => {
        // localStorage.removeItem("user");

        localStorage.removeItem("cart");
        // alert("Logged out successfully!");
        window.location.href = "logout";
      });
    });
  });
});
