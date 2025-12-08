/***********************************************************
 * product.js
 * ---------------------------------------------------------
 * Handles the loading and display of individual product details
 * inside the popup modal. Also connects the "Add to Cart" button
 * so products can be stored via the cart.js functions.
 ***********************************************************/

let productsData2 = [];
// named productsData2 to avoid conflict with cart.js

fetch("products_real_titles")
  .then((res) => res.json())
  .then((data) => {
    productsData2 = data.items;
  });

function initProductDetails(id) {
  // Fetch all product data from the JSON file
  // (Each product has fields like title, price, image, etc.)
  return fetch("products_real_titles.json")
    .then((res) => res.json())
    .then((data) => {
      // Find the product in the data array that matches the given ID
      const item = data.items.find((p) => p.sys.id === id);
      const product = item.fields; // shorthand for easy access

      // --- DETERMINE IMAGE URL ---
      // If the image URL starts with "http", use it directly (external image)
      // Otherwise, prepend "." to make it a relative path (local image)
      const img = product.image.fields.file.url.startsWith("http")
        ? product.image.fields.file.url
        : "." + product.image.fields.file.url;

      // --- UPDATE THE POPUP CONTENT ---
      // Populate all product info in the popup
      document.getElementById("prod-img").src = img;
      document.getElementById("prod-title").textContent = product.title;
      document.getElementById("prod-price").textContent =
        product.price.toFixed(2);
      const catLink = document.getElementById("prod-category-link");
      catLink.textContent = product.category;
      catLink.href = `index.html?category=${encodeURIComponent(
        product.category
      )}`;
      document.getElementById("prod-stock").textContent = product.stock;
      document.getElementById("prod-desc").textContent = product.description;

      // --- Add to Cart button handler ---
      const addBtn = document.querySelector(".modal-add-cart-btn");
      if (addBtn) {
        addBtn.onclick = () => {
          const quantity =
            parseInt(document.getElementById("quantity").value) || 1;

          const title = document.getElementById("prod-title").textContent;
          const price = parseFloat(
            document.getElementById("prod-price").textContent
          );
          const image = document.getElementById("prod-img").src;

          let cart = JSON.parse(localStorage.getItem("cart")) || [];
          const existing = cart.find((c) => c.id === id);
          let inStock = productsData2.find((item) => item.sys.id === id).fields
            .stock;
          // if (existing) existing.quantity += quantity;
          // else cart.push({ id, title, price, image, quantity });
          if (existing) {
            if (existing.quantity < inStock) {
              existing.quantity++;
            } else {
              return false;
            }
          } else {
            if (inStock > 0) {
              cart.push({ id, title, price, image, quantity });
            } else {
              return false;
            }
          }

          localStorage.setItem("cart", JSON.stringify(cart));
          console.log(`${product.title} added to cart!`);

          // successfully added
          addBtn.classList.add("added-to-cart");
          addBtn.textContent = "Added to Cart";
          addBtn.disabled = true;
          setTimeout(() => {
            addBtn.classList.remove("added-to-cart");
            addBtn.textContent = "Add to Cart";
            addBtn.disabled = false;
          }, 1000);
          //alert(`${title} added to cart!`); no alerts!
        };
      }
    });
}
