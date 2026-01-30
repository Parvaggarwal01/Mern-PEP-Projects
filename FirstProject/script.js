let allProducts = [];
const container = document.getElementById("product-container");

const fetchProducts = async () => {
  try {
    const res = await fetch("https://dummyjson.com/products");
    allProducts = (await res.json()).products;

    const params = new URLSearchParams(window.location.search);
    const term = params.get("search");

    if (term) {
      document.getElementById("search-input").value = term;
      displayProducts(
        allProducts.filter((p) =>
          p.title.toLowerCase().includes(term.toLowerCase()),
        ),
      );
    } else {
      displayProducts(allProducts);
    }
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
  const term = document.getElementById("search-input").value;
  const url = new URL(window.location);
  if (term) url.searchParams.set("search", term);
  else url.searchParams.delete("search");
  window.history.pushState({}, "", url);

  displayProducts(
    allProducts.filter((p) =>
      p.title.toLowerCase().includes(term.toLowerCase()),
    ),
  );
};

fetchProducts();
