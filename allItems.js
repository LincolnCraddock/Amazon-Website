let productsData = [];

fetch("products_real_titles.json")
  .then((res) => res.json())
  .then((data) => {
    productsData = data.items;
    const grid = document.getElementById("product-grid");

    productsData.forEach((item) => {
      const product = item.fields;
      const id = item.sys.id;
      const img = product.image.fields.file.url.startsWith("http")
        ? product.image.fields.file.url
        : "." + product.image.fields.file.url;

      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${img}" alt="${product.title}">
        <div class="product-title">${product.title}</div>
        <div class="product-price">$${product.price}</div>
        <div class="product-category">${product.category}</div>
        <button class="add-to-cart-btn" data-id="${id}">Add to Cart</button>
      `;

      document.getElementById("product-grid").appendChild(card);

      card.addEventListener("click", (e) => {
        if (!e.target.classList.contains("add-to-cart-btn")) {
          openModal(id);
        }
      });
    });
  });

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
