// ========== CART MODULE ==========
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// DOM elements
const cartModal = document.getElementById("cart-modal");
const cartBody = document.getElementById("cart-body");
const cartButton = document.getElementById("cart-button");

// Open the cart
cartButton.addEventListener("click", openCart);

function openCart() {
  fetch("cart.html")
    .then((res) => res.text())
    .then((html) => {
      cartBody.innerHTML = html;
      renderCartItems();
      cartModal.classList.remove("hidden");
      setTimeout(() => cartModal.classList.add("show"), 10);
      initCartEvents();
    });
}

// Initialize events for the cart modal
function initCartEvents() {
  cartModal.addEventListener("click", (e) => {
    if (e.target === cartModal) closeCart();
  });

  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      alert("Checkout not implemented yet 😄");
    });
  }
}

// Close the cart
function closeCart() {
  cartModal.classList.remove("show");
  setTimeout(() => cartModal.classList.add("hidden"), 300);
}

// Add a product to cart
function addToCart(product, quantity = 1) {
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }
  saveCart();
  renderCartItems();
}

// Save to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Render items in cart
function renderCartItems() {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalElement = document.getElementById("cart-total");

  if (!cartItemsContainer) return; // if cart HTML not yet loaded

  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    if (cartTotalElement) cartTotalElement.textContent = "0.00";
    return;
  }

  let total = 0;
  cart.forEach((item) => {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("cart-item");
    itemDiv.innerHTML = `
      <div class="cart-item-info">
        <strong>${item.title}</strong><br>
        <span>$${item.price.toFixed(2)} x ${item.quantity}</span>
      </div>
      <button class="remove-btn" data-id="${item.id}">✕</button>
    `;
    cartItemsContainer.appendChild(itemDiv);
    total += item.price * item.quantity;
  });

  cartTotalElement.textContent = total.toFixed(2);

  // Remove item buttons
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      cart = cart.filter((item) => item.id !== id);
      saveCart();
      renderCartItems();
    });
  });
}

// Expose function globally for product.js
window.addToCart = addToCart;
