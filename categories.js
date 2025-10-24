// TODO: maybe we should merge this with allItems.js for efficiency?
fetch("products_real_titles.json")
  .then((response) => response.json())
  .then((data) => {
    var categories = new Set();

    data.items.forEach((productObj) => {
        const product = productObj.fields;
        categories.add(product.category);
    });

    const select = document.getElementById("category-select");

    categories.forEach((category) => {
        const option = document.createElement("option");

        option.value = category;
        option.innerText = category;

        select.appendChild(option);
    });
  })
  .catch((err) => console.error("Error loading product categories:", err));
