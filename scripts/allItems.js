/***********************************************************
 * allitems.js
 * ---------------------------------------------------------
 * Loads all products from the JSON file, displays them
 * in a responsive grid, and handles opening the product modal.
 ***********************************************************/

let productsData = [];

// Defer DOM lookups that might run before the DOM is ready
function getCategorySelect() {
  return document.getElementById("category-select");
}

function fetchStockData() {
  fetch("products_real_titles")
    .then((res) => res.json())
    .then((data) => {
      productsData = data.items;
    });
}

// Fetch all products
fetch("products_real_titles")
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
          <div class="product-price">$${product.price.toFixed(2)}</div>
          <div class="product-category">${product.category}</div>
        </div>
        <button class="add-to-cart-btn" data-id="${id}">Add to Cart</button>
      `;

      // Prevent modal from opening when clicking the Add Cart button
      card.addEventListener("click", (e) => {
        if (e.target.classList.contains("add-to-cart-btn")) return;
        openModal(id);
      });

      grid.appendChild(card);
    });

    // ===== CATEGORY SELECT SETUP =====
    // Wire up the category select element safely (element might not exist if DOM not complete)
    const categorySelect = getCategorySelect();
    if (categorySelect) {
      categorySelect.addEventListener("change", () => {
        filterProducts();
      });
    } else {
      console.warn("category-select not found in DOM when script ran.");
    }

    // === APPLY CATEGORY FROM URL === //
    const params = new URLSearchParams(window.location.search);
    const catFromURL = params.get("category");
    const searchFromURL = params.get("search");

    if (catFromURL) {
      // Try to set the dropdown to the matching option (case-insensitive)
      if (categorySelect) {
        const lowerWanted = catFromURL.toLowerCase();
        let matched = false;

        // Try matching by option value or option text
        Array.from(categorySelect.options).forEach((opt, idx) => {
          if (
            opt.value.toLowerCase() === lowerWanted ||
            opt.text.toLowerCase() === lowerWanted
          ) {
            categorySelect.selectedIndex = idx;
            matched = true;
          }
        });
      }
    }

    if (searchFromURL) {
      // Fill the search bar with the search from the URL
      document.getElementById("search-bar").value = searchFromURL;
    }

    // Filter after a short delay to ensure cards are in the DOM
    if (catFromURL || searchFromURL) {
      setTimeout(() => {
        filterProducts();
      }, 60);
    }

    // Attach Add to Cart events AFTER cards load
    attachAddToCartButtons();
  })
  .catch((err) => {
    console.error("Failed loading products:", err);
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
  let inStock = productsData.find((item) => item.sys.id === product.id).fields
    .stock;
  if (existing) {
    if (existing.quantity < inStock) {
      existing.quantity++;
    } else {
      return false;
    }
  } else {
    if (inStock > 0) {
      cart.push({ ...product, quantity: 1 });
    } else {
      return false;
    }
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  console.log(`${product.title} added to cart!`);
  return true;
}

function attachAddToCartButtons() {
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

        if (addToCart(cartItem)) {
          btn.classList.add("added-to-cart");
          btn.textContent = "Added to Cart";
          btn.disabled = true;
          setTimeout(() => {
            btn.classList.remove("added-to-cart");
            btn.textContent = "Add to Cart";
            btn.disabled = false;
          }, 1000);
        }
      });
    });
  }, 500);
}

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

const categoryDropdown = document.getElementById("category-select");

categoryDropdown.addEventListener("change", () => {
  filterProducts();
});

// note: there is a function called search_items() in search.js that does the same thing
function filterProducts() {
  const selectedCategory = categoryDropdown.value.toLowerCase();
  const searchTerm = document
    .getElementById("search-bar")
    .value.trim()
    .toLowerCase();

  const productCards = document.querySelectorAll(".product-card");

  // set URL paramaters
  // Get the current URL
  const currentUrl = new URL(window.location.href);

  // Clear all search parameters
  currentUrl.search = "";

  // Update the URL in the browser's history without reloading the page
  window.history.replaceState({}, document.title, currentUrl.toString());
  const queryParams = new URLSearchParams(window.location.search);
  queryParams.set("category", selectedCategory);
  queryParams.append("search", searchTerm);
  history.replaceState(null, null, "?" + queryParams.toString());

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
