/***********************************************************
 * cart.js
 * ---------------------------------------------------------
 * Handles the entire shopping cart system:
 * - Opening and closing the cart drawer
 * - Adding / removing / persisting items
 * - Rendering cart items dynamically
 * - Using localStorage for persistence
 ***********************************************************/

// --- INITIALIZATION SECTION --- //
// Load any previously saved cart from localStorage (persistent between sessions)
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Grab references to key DOM elements we’ll interact with
const cartModal = document.getElementById("cart-modal"); // the semi-transparent background overlay
const cartBody = document.getElementById("cart-body"); // the actual white cart drawer
const cartButton = document.getElementById("cart-button"); // the "My Cart" button in header

// --- EVENT LISTENER: OPEN CART --- //
// When user clicks the "My Cart" button, we load the cart HTML and show the modal
cartButton.addEventListener("click", openCart);

// --- FUNCTION: OPEN CART --- //
function openCart() {
  // Fetch the HTML for the cart layout (keeps things modular)
  fetch("cart.html")
    .then((res) => res.text())
    .then((html) => {
      // Insert the fetched HTML into the drawer container
      cartBody.innerHTML = html;

      // Render current cart items immediately (from memory/localStorage)
      renderCartItems();

      // Show modal (remove "hidden" and then add "show" to trigger CSS transition)
      cartModal.classList.remove("hidden");
      setTimeout(() => cartModal.classList.add("show"), 10);

      // Hook up close events and button actions
      initCartEvents();
    });
}

// --- FUNCTION: INITIALIZE CART EVENTS --- //
// Adds event listeners after cart content is loaded
function initCartEvents() {
  // Click outside of the cart drawer closes it
  cartModal.addEventListener("click", (e) => {
    if (e.target === cartModal) closeCart();
  });

  // Optional: Add functionality for checkout button
  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      alert("Checkout not implemented yet 😄");
    });
  }
}

// --- FUNCTION: CLOSE CART --- //
// Smoothly hides the cart drawer with CSS transitions
function closeCart() {
  cartModal.classList.remove("show"); // trigger slide-out animation
  setTimeout(() => cartModal.classList.add("hidden"), 300); // fully hide after animation
}

// --- FUNCTION: ADD TO CART --- //
// Adds a new product to the cart, or increases its quantity if it already exists
function addToCart(product, quantity = 1) {
  // Try to find existing product in the cart
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    // If it already exists, just increase quantity
    existing.quantity += quantity;
  } else {
    // Otherwise, push a new product object into the array
    cart.push({ ...product, quantity });
  }

  // Save changes to localStorage
  saveCart();

  // Re-render cart to reflect updates (if open)
  renderCartItems();
}

// --- FUNCTION: SAVE CART --- //
// Persists the current cart array into localStorage as JSON
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// --- FUNCTION: RENDER CART ITEMS --- //
// Builds and displays all cart items dynamically in the cart panel
function renderCartItems() {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalElement = document.getElementById("cart-total");

  // If cart HTML hasn't loaded yet (cart closed), do nothing
  if (!cartItemsContainer) return;

  // Clear out any previous content
  cartItemsContainer.innerHTML = "";

  // Handle empty cart case
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    if (cartTotalElement) cartTotalElement.textContent = "0.00";
    return;
  }

  // Compute total and build item elements
  let total = 0;
  cart.forEach((item) => {
    // Create a div for each cart item
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("cart-item");

    // Add HTML markup for item info + remove button
    itemDiv.innerHTML = `
      <div class="cart-item-info">
        <strong>${item.title}</strong><br>
        <span>$${item.price.toFixed(2)} x ${item.quantity}</span>
      </div>
      <button class="remove-btn" data-id="${
        item.id
      }" title="Remove item">✕</button>
    `;

    // Append item to cart container
    cartItemsContainer.appendChild(itemDiv);

    // Add to total
    total += item.price * item.quantity;
  });

  // Display total
  cartTotalElement.textContent = total.toFixed(2);

  // Attach "remove" button listeners for all current items
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      // Remove item by filtering out its ID
      cart = cart.filter((item) => item.id !== id);
      saveCart();
      renderCartItems();
    });
  });
}

// --- EXPORT: MAKE ADD FUNCTION GLOBAL --- //
// Allows product.js to use `addToCart()` even though it's defined here
window.addToCart = addToCart;
