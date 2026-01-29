let allProducts = [];
const container = document.getElementById("product-container");

const fetchProducts = async () => {
  try {
    const res = await fetch("https://dummyjson.com/products");
    allProducts = (await res.json()).products;
    displayProducts(allProducts);
  } catch {
    container.innerHTML = "<p>Error loading products.</p>";
  }
};

const displayProducts = (products) => {
  container.innerHTML = products.length
    ? products
        .map(
          (p) => `
        <div class="card">
            <div class="card-image-container">
                <img src="${p.thumbnail}" alt="${p.title}" loading="lazy">
            </div>
            <h2 class="card-title">${p.title}</h2>
            <div class="card-price">$${p.price}</div>
        </div>
    `,
        )
        .join("")
    : "<p>No products found.</p>";
};

document.getElementById("search-button").onclick = () => {
  const term = document.getElementById("search-input").value.toLowerCase();
  displayProducts(
    allProducts.filter((p) => p.title.toLowerCase().includes(term)),
  );
};

fetchProducts();
