const searchInput = document.getElementById("search-bar");
const searchButton = document.getElementById("search-button");

searchButton.addEventListener("click", () => {
  const searchedItem = searchInput.value.trim().toLowerCase();
  const productCards = document.querySelectorAll(".product-card");
  categorySelect.dispatchEvent(new Event("change"));

  productCards.forEach((card) => {
    const title = card
      .querySelector(".product-title")
      .textContent.toLowerCase();
    const category = card
      .querySelector(".product-category")
      .textContent.toLowerCase();

    if (title.includes(searchedItem) || category.includes(searchedItem)) {
      // show item
      card.style.display = ""; // make it visible immediately
      setTimeout(() => card.classList.remove("hidden"), 10); // remove hidden class to trigger fade in
    } else {
      // hide item with animation
      card.classList.add("hidden"); // start fade-out
      setTimeout(() => (card.style.display = "none"), 300); // hide completely after animation
    }
  });
});
