/***********************************************************
 * product.js
 * ---------------------------------------------------------
 * Handles the loading and display of individual product details
 * inside the popup modal. Also connects the "Add to Cart" button
 * so products can be stored via the cart.js functions.
 ***********************************************************/

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
      document.getElementById("prod-price").textContent = product.price;
      document.getElementById("prod-category").textContent = product.category;
      document.getElementById("prod-stock").textContent = product.stock;
      document.getElementById("prod-desc").textContent = product.description;

      // --- HANDLE ADD-TO-CART FUNCTIONALITY ---
      // Get the Add to Cart button inside the modal
      const addCartBtn = document.querySelector(".add-cart-btn");

      // Attach click event listener
      addCartBtn.onclick = () => {
        // Get the quantity value entered by the user
        const quantity = parseInt(document.getElementById("quantity").value);

        // Build a simplified product object for cart storage
        const productData = {
          id: id,
          title: product.title,
          price: product.price,
        };

        // Call the global addToCart() function defined in cart.js
        addToCart(productData, quantity);

        // Give the user feedback that the item was added
        alert(`${product.title} added to cart!`);
      };
    });
}
