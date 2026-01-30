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
        <a href="product.html?id=${p.id}" class="card" style="text-decoration: none; color: inherit;">
            <div class="card-image-container">
                <img src="${p.thumbnail}" alt="${p.title}" loading="lazy">
            </div>
            <h2 class="card-title">${p.title}</h2>
            <div class="card-price">$${p.price}</div>
        </a>
    `,
        )
        .join("")
    : "<p>No products found.</p>";
};

const searchInput = document.getElementById("search-input");
const suggestionsList = document.getElementById("suggestions-list");

const getHistory = () => {
  let history = JSON.parse(localStorage.getItem("searchHistory") || "[]");
  if (history.length && typeof history[0] === "string") {
    history = history.map((term) => ({
      term,
      timestamp: new Date().toLocaleString(),
    }));
    localStorage.setItem("searchHistory", JSON.stringify(history));
  }
  return history;
};

const saveHistory = (term) => {
  if (!term) return;
  let history = getHistory();
  history = history.filter((h) => h.term.toLowerCase() !== term.toLowerCase());
  history.unshift({ term, timestamp: new Date().toLocaleString() });
  localStorage.setItem("searchHistory", JSON.stringify(history.slice(0, 50)));
};

const showSuggestions = (items) => {
  if (!items.length) {
    suggestionsList.classList.add("hidden");
    return;
  }
  suggestionsList.innerHTML = items
    .map((item) => `<li>${item.term}</li>`)
    .join("");
  suggestionsList.classList.remove("hidden");
};

searchInput.addEventListener("focus", () => showSuggestions(getHistory()));
searchInput.addEventListener("input", (e) => {
  const term = e.target.value.toLowerCase();
  const history = getHistory();
  const filtered = history.filter((h) => h.term.toLowerCase().includes(term));
  showSuggestions(term ? filtered : history);
});

suggestionsList.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    searchInput.value = e.target.textContent;
    suggestionsList.classList.add("hidden");
    document.getElementById("search-button").click();
  }
});

document.addEventListener("click", (e) => {
  if (
    !e.target.closest("#input-wrapper") &&
    !e.target.closest("#history-button")
  ) {
    suggestionsList.classList.add("hidden");
  }
});

document.getElementById("history-button").onclick = () => {
  window.location.href = "history.html";
};

document.getElementById("view-button").onclick = () => {
  window.location.href = "view-history.html";
};

document.getElementById("search-button").onclick = () => {
  const term = searchInput.value;
  saveHistory(term);

  const url = new URL(window.location);
  if (term) url.searchParams.set("search", term);
  else url.searchParams.delete("search");
  window.history.pushState({}, "", url);

  displayProducts(
    allProducts.filter((p) =>
      p.title.toLowerCase().includes(term.toLowerCase()),
    ),
  );
  suggestionsList.classList.add("hidden");
};

fetchProducts();
