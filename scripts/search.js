const searchInput = document.getElementById("search-bar");
const searchButton = document.getElementById("search-button");


function search_items() {
  const searchedItem = searchInput.value.trim().toLowerCase();
  const productCards = document.querySelectorAll(".product-card");

  // STEP 1: fade out all cards
  productCards.forEach(card => {
    card.classList.add("hidden"); 
  });

  // STEP 2: after fade-out, show only matches
  setTimeout(() => {
    productCards.forEach(card => {
      const title = card.querySelector(".product-title").textContent.toLowerCase();
      const category = card.querySelector(".product-category").textContent.toLowerCase();

      const match = title.includes(searchedItem) || category.includes(searchedItem);

      if (match) {
        card.style.display = ""; // make visible
        setTimeout(() => card.classList.remove("hidden"), 20); // fade in
      } else {
        card.style.display = "none"; // fully hide unmatched cards
      }
    });
  }, 300); // matches CSS animation duration
}
searchButton.addEventListener("click", () => {
  search_items();
});

searchInput.addEventListener("keyup", e => {
  if (e.key === "Enter"){
    search_items();
  }
});