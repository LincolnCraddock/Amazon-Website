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
      `;
      card.addEventListener("click", () => openModal(id));
      grid.appendChild(card);
    });
  });

// Modal elements
const modal = document.getElementById("product-modal");
const modalBody = document.getElementById("modal-body");

// Open product modal
function openModal(id) {
  modalBody.innerHTML = `<p style="text-align:center">Loading...</p>`;

  fetch("product.html")
    .then((res) => res.text())
    .then((html) => {
      modalBody.innerHTML = html;

      // If product.js isn't already loaded, load it
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

// Initialize and show modal
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
