/*********************************************************************
 * search.js handles the logic behind searching. Products are hidden by
 * default and are unhidden when searched.
 *
 *********************************************************************/

const searchInput = document.getElementById("search-bar"); //searchbar where user enters
const searchButton = document.getElementById("search-button"); // button that initiates the search
const categoryDropdown2 = document.getElementById("category-select"); // dropdown where the user selects the category
// named 'categoryDropdown2' so as not to conflict with the one from allItems.js, I believe

// note: there is a function called filterProducts() in allItems.js that does the same thing
// probably no big deal
function search_items() {
  const searchedItem = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryDropdown.value.trim().toLowerCase();
  const productCards = document.querySelectorAll(".product-card");

  // STEP 1: fade out all cards
  productCards.forEach((card) => {
    card.classList.add("hidden");
  });

  // STEP 2: after fade-out, show only matches
  setTimeout(() => {
    productCards.forEach((card) => {
      const title = card
        .querySelector(".product-title")
        .textContent.toLowerCase();
      const category = card
        .querySelector(".product-category")
        .textContent.toLowerCase();

      const match =
        (title.includes(searchedItem) || category.includes(searchedItem)) &&
        (selectedCategory == "all" || category == selectedCategory);

      if (match) {
        card.style.display = ""; // make visible
        setTimeout(() => card.classList.remove("hidden"), 20); // fade in
      } else {
        card.style.display = "none"; // fully hide unmatched cards
      }
    });
  }, 300); // matches CSS duration

  // STEP 3: update the url to represent the search
  // Get the current URL
  const currentUrl = new URL(window.location.href);

  // Clear all search parameters
  currentUrl.search = "";

  // Update the URL in the browser's history without reloading the page
  window.history.replaceState({}, document.title, currentUrl.toString());
  const queryParams = new URLSearchParams(window.location.search);
  queryParams.set("category", selectedCategory);
  queryParams.append("search", searchedItem);
  history.replaceState(null, null, "?" + queryParams.toString());
}

/* ------------------- EVENT LISTENERS --------------------------*/
searchButton.addEventListener("click", () => {
  search_items();
});

searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    search_items();
  }
});
