function renderCart() {
  const cartContainer = document.getElementById("cart-items");
  const totalDisplay = document.getElementById("cart-total");
  const clearCartBtn = document.getElementById("clear-cart-btn");
  const checkoutBtn = document.getElementById("checkout-btn");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cartContainer.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    totalDisplay.textContent = "0.00";
    clearCartBtn.style.display = "none";
    checkoutBtn.style.display = "none";
    return;
  }

  clearCartBtn.style.display = "inline-block";
  checkoutBtn.style.display = "inline-block";

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div class="cart-left">
        <img src="${item.image}" alt="${
      item.title
    }" style="width:80px;height:100px;object-fit:cover;">
        <div class="cart-info">
          <p><strong>${item.title}</strong></p>
          <p>Price: $${item.price.toFixed(2)}</p>
          <p>Subtotal: $${itemTotal.toFixed(2)}</p>
        </div>
      </div>
      <div class="cart-controls">
        <button class="qty-btn" data-index="${index}" data-action="decrease">-</button>
        <span class="quantity">${item.quantity}</span>
        <button class="qty-btn" data-index="${index}" data-action="increase">+</button>
        <button class="remove-btn" data-index="${index}">Remove</button>
      </div>
    `;
    cartContainer.appendChild(div);
  });

  totalDisplay.textContent = total.toFixed(2);

  // Quantity adjusters
  document.querySelectorAll(".qty-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idx = parseInt(e.target.dataset.index);
      const action = e.target.dataset.action;
      if (action === "increase") cart[idx].quantity++;
      else if (action === "decrease" && cart[idx].quantity > 1)
        cart[idx].quantity--;
      else if (action === "decrease" && cart[idx].quantity === 1)
        cart.splice(idx, 1);

      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    });
  });

  // Remove item
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idx = parseInt(e.target.dataset.index);
      cart.splice(idx, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    });
  });

  // Clear cart
  clearCartBtn.onclick = () => {
    if (confirm("Are you sure you want to clear your cart?")) {
      localStorage.removeItem("cart");
      renderCart();
    }
  };

  checkoutBtn.onclick = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    alert(`Thank you for your purchase! Total: $${total.toFixed(2)}`);
    localStorage.removeItem("cart");
    renderCart();
  };
}

renderCart();
