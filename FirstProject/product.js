async function fetchProductDetails() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    document.body.innerHTML =
      "<h1>Product not found</h1><a href='index.html'>Go Home</a>";
    return;
  }

  try {
    const res = await fetch(`https://dummyjson.com/products/${id}`);
    if (!res.ok) throw new Error("Product not found");
    const product = await res.json();
    renderProduct(product);
  } catch (err) {
    console.error(err);
    document.getElementById("product-detail-container").innerHTML =
      "<p>Error loading product details.</p>";
  }
}

function addToViewHistory(product) {
  let history = JSON.parse(localStorage.getItem("viewHistory") || "[]");
  history = history.filter((item) => item.id !== product.id);
  history.unshift({
    id: product.id,
    title: product.title,
    timestamp: new Date().toLocaleString(),
  });
  localStorage.setItem("viewHistory", JSON.stringify(history.slice(0, 50)));
}

function renderProduct(product) {
  addToViewHistory(product);
  const imageSection = document.querySelector(".product-image-section");
  imageSection.innerHTML = `<img src="${product.images[0] || product.thumbnail}" alt="${product.title}">`;

  const infoSection = document.querySelector(".product-info-section");

  infoSection.innerHTML = `
            <div class="product-meta">
                ${product.brand ? `<span>${product.brand}</span> | ` : ""}
                <span>${product.category}</span>
            </div>
            <h1 class="product-title">${product.title}</h1>

            <div class="product-price">
                $${product.price}
            </div>

            <p>${product.description}</p>

            <div class="field-row">
                <span class="field-label">Availability</span>
                <span>${product.availabilityStatus}</span>
            </div>
            <div class="field-row">
                <span class="field-label">Stock</span>
                <span>${product.stock} units</span>
            </div>
             <div class="field-row">
                <span class="field-label">Rating</span>
                <span>${product.rating} / 5</span>
            </div>
            <div class="field-row">
                <span class="field-label">SKU</span>
                <span>${product.sku}</span>
            </div>
            <div class="field-row">
                <span class="field-label">Weight</span>
                <span>${product.weight}</span>
            </div>
             <div class="field-row">
                <span class="field-label">Warranty</span>
                <span>${product.warrantyInformation}</span>
            </div>
            <div class="field-row">
                <span class="field-label">Return Policy</span>
                <span>${product.returnPolicy}</span>
            </div>
            <div class="field-row">
                <span class="field-label">Shipping</span>
                <span>${product.shippingInformation}</span>
            </div>
            <div class="field-row">
                <span class="field-label">Min. Order</span>
                <span>${product.minimumOrderQuantity}</span>
            </div>

            <div class="tags-container">
                ${product.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
            </div>
          `;
}

fetchProductDetails();
