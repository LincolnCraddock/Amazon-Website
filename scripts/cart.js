/***********************************************************
 * cart.js
 * ---------------------------------------------------------
 * Handles:
 *  - rendering cart items
 *  - quantity changes
 *  - removing items
 *  - clearing cart
 *  - checkout
 *  - sidebar open/close logic (with blur + overlay)
 ***********************************************************/

function renderCart() {
  const cartContainer = document.getElementById("cart-items");
  const totalDisplay = document.getElementById("cart-total");
  const clearCartBtn = document.getElementById("clear-cart-btn");
  const checkoutBtn = document.getElementById("checkout-btn");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cartContainer.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    totalDisplay.textContent = "0.00";
    clearCartBtn.style.display = "none";
    checkoutBtn.style.display = "none";
    return;
  }

  clearCartBtn.style.display = "inline-block";
  checkoutBtn.style.display = "inline-block";

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div class="cart-left">
        <img 
          src="${item.image}" 
          alt="${item.title}" 
          style="width:80px;height:100px;object-fit:cover;"
        >
        <div class="cart-info">
          <p><strong>${item.title}</strong></p>
          <p>Price: $${item.price.toFixed(2)}</p>
          <p>Subtotal: $${itemTotal.toFixed(2)}</p>
        </div>
      </div>

      <div class="cart-controls">
        <button class="qty-btn" data-index="${index}" data-action="decrease">-</button>
        <span class="quantity">${item.quantity}</span>
        <button class="qty-btn" data-index="${index}" data-action="increase">+</button>

        <button class="remove-btn" data-index="${index}">
          Remove
        </button>
      </div>
    `;

    cartContainer.appendChild(div);
  });

  totalDisplay.textContent = total.toFixed(2);

  // increase/decrease qty
  document.querySelectorAll(".qty-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const idx = parseInt(e.target.dataset.index);
      const action = e.target.dataset.action;

      if (action === "increase") {
        let inStock = productsData.find((item) => item.sys.id === cart[idx].id)
          .fields.stock;
        if (cart[idx].quantity < inStock) {
          cart[idx].quantity++;
          // if (cart[idx].quantity === inStock) {
          //   Reached stock limit. Could gray out button.
          // }
        } else {
          // Failed to increase
        }
      } else if (action === "decrease" && cart[idx].quantity > 1) {
        cart[idx].quantity--;
      } else if (action === "decrease" && cart[idx].quantity === 1) {
        cart.splice(idx, 1);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    });
  });

  // remove item
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const idx = parseInt(e.target.dataset.index);
      cart.splice(idx, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    });
  });

  // clear cart button
  clearCartBtn.onclick = () => {
    if (confirm("Are you sure you want to clear your cart?")) {
      localStorage.removeItem("cart");
      renderCart();
    }
  };

  // checkout button
  checkoutBtn.onclick = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const fetched = await fetch("/auth-status");
    const status = await fetched.json();
    if (!status.loggedIn) {
      alert("You are not logged in!");
      return;
    }

    const res = await fetch("/order", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cart: JSON.parse(localStorage.getItem("cart")),
        email: status.email,
      }),
    });

    alert(`Thank you for your purchase! Total: $${total.toFixed(2)}`);

    localStorage.removeItem("cart");
    renderCart();
  };
}

// INITIAL CART RENDER
renderCart();

document.addEventListener("DOMContentLoaded", () => {
  const cartBtn = document.getElementById("cart-button");
  const cartSidebar = document.getElementById("cart-sidebar");
  const cartOverlay = document.getElementById("cart-overlay");
  const closeCart = document.getElementById("close-cart");

  console.log("Sidebar Elements:", {
    cartBtn,
    cartSidebar,
    cartOverlay,
    closeCart,
  });

  // If anything is missing, don't crash
  if (!cartBtn || !cartSidebar || !cartOverlay || !closeCart) {
    console.warn("Cart sidebar failed to initialize. Missing DOM IDs.");
    return;
  }

  // Remove hidden so CSS animation controls visibility
  cartSidebar.classList.remove("hidden");
  cartOverlay.classList.remove("hidden");

  // Open sidebar
  cartBtn.addEventListener("click", () => {
    cartSidebar.classList.add("open");
    cartOverlay.classList.add("show");
  });

  // Close using X
  closeCart.addEventListener("click", () => {
    cartSidebar.classList.remove("open");
    cartOverlay.classList.remove("show");
  });

  // Close by clicking overlay
  cartOverlay.addEventListener("click", () => {
    cartSidebar.classList.remove("open");
    cartOverlay.classList.remove("show");
  });
});
