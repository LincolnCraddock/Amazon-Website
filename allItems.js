/***********************************************************
 * allitems.js
 * ---------------------------------------------------------
 * Loads all products from the JSON file, displays them
 * in a responsive grid on the homepage, and handles opening
 * the detailed product popup (modal).
 ***********************************************************/

// Initialize an empty array to store all product data globally
let productsData = [];

// Fetch product data from the JSON file
fetch("products_real_titles.json")
  .then((res) => res.json()) // Parse the JSON response
  .then((data) => {
    // Store the array of items globally for easy access
    productsData = data.items;

    // Get reference to the grid container on the page
    const grid = document.getElementById("product-grid");

    // Loop through every product in the data
    productsData.forEach((item) => {
      const product = item.fields; // Shortcut to the product's field data
      const id = item.sys.id; // Each product has a unique ID

      // --- IMAGE URL HANDLING ---
      // Some images are local, others may be hosted externally
      const img = product.image.fields.file.url.startsWith("http")
        ? product.image.fields.file.url // use as-is if HTTP URL
        : "." + product.image.fields.file.url; // prepend dot for local paths

      // --- CREATE PRODUCT CARD ELEMENT ---
      const card = document.createElement("div");
      card.className = "product-card";

      // Set the inner HTML structure of each product card
      card.innerHTML = `
        <img src="${img}" alt="${product.title}">
        <div class="product-title">${product.title}</div>
        <div class="product-price">$${product.price}</div>
        <div class="product-category">${product.category}</div>
        <button class="add-to-cart-btn" data-id="${id}">Add to Cart</button>
      `;

      // --- CLICK EVENT: OPEN PRODUCT POPUP ---
      // When the card is clicked, open the product detail modal
      card.addEventListener("click", () => openModal(id));

      // Finally, add the product card to the grid container
      grid.appendChild(card);
    });
  });

// --- MODAL SETUP --- //
// The modal is hidden by default until a user clicks a product
const modal = document.getElementById("product-modal");
const modalBody = document.getElementById("modal-body");

// --- FUNCTION: OPEN MODAL --- //
// Loads the product detail HTML into the popup and shows it
function openModal(id) {
  // Temporary loading message while content is fetched
  modalBody.innerHTML = `<p style="text-align:center">Loading...</p>`;

  // Fetch the HTML template for the product detail view
  fetch("product.html")
    .then((res) => res.text())
    .then((html) => {
      // Insert the HTML structure into the modal body
      modalBody.innerHTML = html;

      // If product.js (the logic file for product details)
      // hasn’t been loaded yet, load it dynamically
      if (!window.initProductDetails) {
        const script = document.createElement("script");
        script.src = "product.js";
        // Once script is loaded, display the specific product
        script.onload = () => showProduct(id);
        document.body.appendChild(script);
      } else {
        // If already loaded, just display the product immediately
        showProduct(id);
      }
    });
}

// --- FUNCTION: SHOW PRODUCT IN MODAL --- //
// Actually displays the chosen product and handles closing behavior
function showProduct(id) {
  // Call function from product.js to fill modal with content
  initProductDetails(id).then(() => {
    // Handle close button (X in the corner)
    const closeBtn = document.querySelector(".close-btn");
    closeBtn.onclick = () => modal.classList.add("hidden");

    // Handle click outside the popup to close it
    window.onclick = (e) => {
      if (e.target === modal) modal.classList.add("hidden");
    };

    // Reveal the modal (fade-in / display flex)
    modal.classList.remove("hidden");
  });
}

// ------------------- CART LOGIC -------------------

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  console.log(`${product.title} added to cart!`);
}

setTimeout(() => {
  const buttons = document.querySelectorAll(".add-to-cart-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = e.target.dataset.id;
      const item = productsData.find((p) => p.sys.id === id);
      if (!item) return;

      const product = item.fields;
      const img = product.image.fields.file.url.startsWith("http")
        ? product.image.fields.file.url
        : "." + product.image.fields.file.url;

      const cartItem = {
        id: item.sys.id,
        title: product.title,
        price: product.price,
        image: img,
      };

      addToCart(cartItem);
      alert(`${product.title} added to cart!`);
    });
  });
}, 500);

const cartButton = document.getElementById("cart-button");
const cartSidebar = document.getElementById("cart-sidebar");
const closeCartBtn = document.getElementById("close-cart");

cartButton.addEventListener("click", () => {
  cartSidebar.classList.add("visible");
  renderCart(); // this uses your existing cart.js logic
});

closeCartBtn.addEventListener("click", () => {
  cartSidebar.classList.remove("visible");
});
