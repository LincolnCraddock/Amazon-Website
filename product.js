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

      // Add-to-cart functionality
      const addCartBtn = document.querySelector(".add-cart-btn");
      addCartBtn.onclick = () => {
        const quantity = parseInt(document.getElementById("quantity").value);
        const productData = {
          id: id,
          title: product.title,
          price: product.price,
        };
        addToCart(productData, quantity);
        alert(`${product.title} added to cart!`);
      };
    });
}
