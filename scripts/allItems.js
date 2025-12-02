/***********************************************************
 * allitems.js
 * ---------------------------------------------------------
 * Loads all products from the JSON file, displays them
 * in a responsive grid, and handles opening the product modal.
 ***********************************************************/

let productsData = [];

// Fetch all products
fetch("products_real_titles.json")
  .then((res) => res.json())
  .then((data) => {
    productsData = data.items;
    const grid = document.getElementById("product-grid");

    productsData.forEach((item) => {
      const product = item.fields;
      const id = item.sys.id;

      // Image URL
      const img = product.image.fields.file.url.startsWith("http")
        ? product.image.fields.file.url
        : "." + product.image.fields.file.url;

      // Create card
      const card = document.createElement("div");
      card.className = "product-card";

      card.innerHTML = `
        <img src="${img}" alt="${product.title}">
        <div class="product-info-block">
          <div class="product-title">${product.title}</div>
          <div class="product-price">$${product.price}</div>
          <div class="product-category">${product.category}</div>
        </div>
        <button class="add-cart-btn" data-id="${id}">Add to Cart</button>
      `;

      // Prevent modal from opening when clicking the Add Cart button
      card.addEventListener("click", (e) => {
        if (e.target.classList.contains("add-cart-btn")) return;
        openModal(id);
      });

      grid.appendChild(card);
    });

    // Attach Add to Cart events AFTER cards load
    attachAddToCartButtons();
  });

// ===== OPEN MODAL ===== //

const modal = document.getElementById("product-modal");
const modalBody = document.getElementById("modal-body");

function openModal(id) {
  modalBody.innerHTML = `<p style="text-align:center">Loading...</p>`;

  fetch("product.html")
    .then((res) => res.text())
    .then((html) => {
      modalBody.innerHTML = html;

      if (!window.initProductDetails) {
        const script = document.createElement("script");
        script.src = "product.js";
        script.onload = () => showProduct(id);
        document.body.appendChild(script);
      } else {
        showProduct(id);
      }
    });
}

function showProduct(id) {
  initProductDetails(id).then(() => {
    const closeBtn = document.querySelector(".close-btn");
    closeBtn.onclick = () => modal.classList.add("hidden");

    window.onclick = (e) => {
      if (e.target === modal) modal.classList.add("hidden");
    };

    modal.classList.remove("hidden");
  });
}

// ===== CART LOGIC ===== //

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
      e.stopPropagation(); // Stop card click

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

// ===== CART SIDEBAR ===== //

const cartButton = document.getElementById("cart-button");
const cartSidebar = document.getElementById("cart-sidebar");
const closeCartBtn = document.getElementById("close-cart");
const cartOverlay = document.getElementById("cart-overlay");

if (cartButton && cartSidebar && cartOverlay) {
  cartButton.addEventListener("click", () => {
    cartSidebar.classList.add("visible");
    cartOverlay.classList.add("visible");
    renderCart();
  });

  closeCartBtn.addEventListener("click", () => {
    cartSidebar.classList.remove("visible");
    cartOverlay.classList.remove("visible");
  });

  cartOverlay.addEventListener("click", () => {
    cartSidebar.classList.remove("visible");
    cartOverlay.classList.remove("visible");
  });
}

// ===== CATEGORY FILTER ===== //

const categorySelect = document.getElementById("category-select");

categorySelect.addEventListener("change", () => {
  filterProducts();
});

function filterProducts() {
  const selectedCategory = categorySelect.value.toLowerCase();
  const searchTerm = document
    .getElementById("search-bar")
    .value.trim()
    .toLowerCase();

  const productCards = document.querySelectorAll(".product-card");

  productCards.forEach((card) => {
    const title = card
      .querySelector(".product-title")
      .textContent.toLowerCase();
    const category = card
      .querySelector(".product-category")
      .textContent.toLowerCase();

    const matchesCategory =
      selectedCategory === "all" || category === selectedCategory;
    const matchesSearch =
      !searchTerm ||
      title.includes(searchTerm) ||
      category.includes(searchTerm);

    if (matchesCategory && matchesSearch) {
      card.style.display = "";
      setTimeout(() => card.classList.remove("hidden"), 10);
    } else {
      card.classList.add("hidden");
      setTimeout(() => (card.style.display = "none"), 300);
    }
  });
}
