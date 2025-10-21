// popup.js

document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("openPopup");
  const popupContainer = document.getElementById("popupContainer");

  openBtn.addEventListener("click", async () => {
    try {
      // Fetch popup HTML from separate file
      const response = await fetch("popup.html");
      const popupHTML = await response.text();

      // Insert HTML and show popup
      popupContainer.innerHTML = popupHTML;
      popupContainer.style.display = "flex";

      // Add event listener for close button in popup.html
      const closeBtn = popupContainer.querySelector("#closePopup");
      if (closeBtn) {
        closeBtn.addEventListener("click", () => {
          popupContainer.style.display = "none";
          popupContainer.innerHTML = ""; // clean up
        });
      }
    } catch (error) {
      console.error("Error loading popup:", error);
    }
  });
});
