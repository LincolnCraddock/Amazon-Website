const categoryDropdown = document.getElementById("category-select");
const searchBar = document.getElementById("search-bar");

// === APPLY CATEGORY FROM URL === //
const params = new URLSearchParams(window.location.search);
const catFromURL = params.get("category");
const searchFromURL = params.get("search");

if (catFromURL) {
  // Try to set the dropdown to the matching option (case-insensitive)
  if (categoryDropdown) {
    const lowerWanted = catFromURL.toLowerCase();
    let matched = false;

    // Try matching by option value or option text
    Array.from(categoryDropdown.options).forEach((opt, idx) => {
      if (
        opt.value.toLowerCase() === lowerWanted ||
        opt.text.toLowerCase() === lowerWanted
      ) {
        categoryDropdown.selectedIndex = idx;
        matched = true;
      }
    });
  }
}

if (searchFromURL) {
  // Fill the search bar with the search from the URL
  searchBar.value = searchFromURL;
}

function updateSearchButtonURL() {
  const searchBtnLink = document.getElementById("search-button-link");
  searchBtnLink.href = `/?category=${encodeURIComponent(
    categoryDropdown.value.toLowerCase()
  )}&search=${encodeURIComponent(searchBar.value.trim())}`;
}

searchBar.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    const searchBtn = document.getElementById("search-button");
    searchBtn.click();
  }
});
