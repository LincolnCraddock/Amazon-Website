fetch("products_real_titles.json")
  .then((response) => response.json())
  .then((data) => {
    const grid = document.getElementById("product-grid");

    data.items.forEach((productObj) => {
      const product = productObj.fields;
      const imgUrl = product.image.fields.file.url.startsWith("http")
        ? product.image.fields.file.url
        : "." + product.image.fields.file.url;

      const div = document.createElement("div");
      div.className = "product-card";

      div.innerHTML = `
        <img src="${imgUrl}" alt="${product.title}">
        <div class="product-title">${product.title}</div>
        <div class="product-price">$${product.price}</div>
        <div class="product-category">${product.category}</div>
      `;

      grid.appendChild(div);
    });
  })
  .catch((err) => console.error("Error loading products:", err));
