function initProductDetails(id) {
  return fetch("products_real_titles.json")
    .then((res) => res.json())
    .then((data) => {
      const item = data.items.find((p) => p.sys.id === id);
      const product = item.fields;

      const img = product.image.fields.file.url.startsWith("http")
        ? product.image.fields.file.url
        : "." + product.image.fields.file.url;

      document.getElementById("prod-img").src = img;
      document.getElementById("prod-title").textContent = product.title;
      document.getElementById("prod-price").textContent = product.price;
      document.getElementById("prod-category").textContent = product.category;
      document.getElementById("prod-stock").textContent = product.stock;
      document.getElementById("prod-desc").textContent = product.description;

      // --- Add to Cart button handler ---
      const addBtn = document.querySelector(".add-cart-btn");
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
          if (existing) existing.quantity += quantity;
          else cart.push({ id, title, price, image, quantity });

          localStorage.setItem("cart", JSON.stringify(cart));
          alert(`${title} added to cart!`);
        };
      }
    });
}
