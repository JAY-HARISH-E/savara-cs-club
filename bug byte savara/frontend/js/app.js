const API = "http://localhost:5000";

/* USER LOGIN */
async function userLogin() {
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;

  const res = await fetch(API + "/api/user/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ username: u, password: p })
  });

  const data = await res.json();

  if (data.success) window.location.href = "home.html";
  else alert("Login failed");
}

/* REGISTER */
async function register() {
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;

  const res = await fetch(API + "/api/user/register", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ username: u, password: p })
  });

  const data = await res.json();

  if (data.success) {
    alert("Registered!");
    window.location.href = "login.html";
  }
}

/* PRODUCTS */
async function loadProducts() {
  const res = await fetch(API + "/api/products");
  const data = await res.json();

  const list = document.getElementById("list");
  list.innerHTML = "";

  data.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";

    div.innerHTML = `
      <h4>${p.name}</h4>
      <p>₹${p.price}</p>
      <button onclick="addToCart(${p.id}, '${p.name}', ${p.price})">Cart</button>
      <button onclick="buyNow(${p.id}, '${p.name}', ${p.price})">Buy</button>
    `;

    list.appendChild(div);
  });
}

/* CART */
function addToCart(id, name, price) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push({ id, name, price });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart");
}

/* BUY */
function buyNow(id, name, price) {
  localStorage.setItem("buyNowItem", JSON.stringify({ id, name, price }));
  window.location.href = "checkout.html";
}

/* ORDER */
async function placeOrder() {
  const name = document.getElementById("name").value;
  const card = document.getElementById("card").value;

  let item = JSON.parse(localStorage.getItem("buyNowItem"));
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const items = item ? [item] : cart;

  await fetch(API + "/api/orders", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ items, name, card })
  });

  alert("Order placed!");
  localStorage.clear();
  window.location.href = "home.html";
}

/* ADMIN */
function checkAdmin() {
  if (localStorage.getItem("admin") !== "true")
    window.location.href = "login.html";
}

async function adminLogin() {
  const u = username.value;
  const p = password.value;

  const res = await fetch(API + "/api/admin/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ username: u, password: p })
  });

  const data = await res.json();

  if (data.success) {
    localStorage.setItem("admin", "true");
    window.location.href = "dashboard.html";
  }
}

function logout() {
  localStorage.removeItem("admin");
  window.location.href = "login.html";
}

async function loadProductsAdmin() {
  const res = await fetch(API + "/api/products");
  const data = await res.json();

  list.innerHTML = "";

  data.forEach(p => {
    list.innerHTML += `
      <div>
        ${p.name} ₹${p.price}
        <button onclick="deleteProduct(${p.id})">Delete</button>
      </div>
    `;
  });
}

async function addProduct() {
  await fetch(API + "/api/products", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ name: name.value, price: price.value })
  });

  loadProductsAdmin();
}

async function deleteProduct(id) {
  await fetch(API + "/api/products/" + id, { method: "DELETE" });
  loadProductsAdmin();
}

async function loadOrders() {
  const res = await fetch(API + "/api/orders");
  const data = await res.json();

  orders.innerHTML = "";

  data.forEach(o => {
    orders.innerHTML += `<p>${o.name} ordered ${o.items.length} items</p>`;
  });
}