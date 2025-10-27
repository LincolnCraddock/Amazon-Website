const searchInput = document.getElementById("search-bar");
const searchButton = document.getElementById("search-button");

searchButton.addEventListener("click", () => {
  const term = searchInput.value.toLowerCase();
  const productCards = document.querySelectorAll(".product-card");

  productCards.forEach((card) => {
    const title = card.querySelector(".product-title").textContent.toLowerCase();
    const category = card.querySelector(".product-category").textContent.toLowerCase();

    if (title.includes(term) || category.includes(term)) {
      card.style.display = ""; // show
    } else {
      card.style.display = "none"; // hide
    }
  });
});