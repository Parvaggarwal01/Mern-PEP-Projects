let allProducts = [];
const container = document.getElementById("product-container");
let currentPage = 1;
const limit = 10; // Items per page
let totalProducts = 0;

const fetchProducts = async (page = 1, searchQuery = "") => {
  try {
    const skip = (page - 1) * limit;
    let url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;

    if (searchQuery) {
      url = `https://dummyjson.com/products/search?q=${searchQuery}&limit=${limit}&skip=${skip}`;
    }

    const res = await fetch(url);
    const data = await res.json();
    allProducts = data.products;
    totalProducts = data.total;

    displayProducts(allProducts);
    updatePagination(page);
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Error loading products.</p>";
  }
};

const updatePagination = (page) => {
  currentPage = page;
  document.getElementById("page-info").textContent = `Page ${currentPage}`;
  document.getElementById("prev-btn").disabled = currentPage === 1;
  // Calculate total pages
  const totalPages = Math.ceil(totalProducts / limit);
  document.getElementById("next-btn").disabled = currentPage >= totalPages;
};

document.getElementById("prev-btn").onclick = () => {
  if (currentPage > 1) {
    const url = new URL(window.location);
    url.searchParams.set("page", currentPage - 1);
    window.history.pushState({}, "", url);
    fetchProducts(
      currentPage - 1,
      document.getElementById("search-input").value,
    );
  }
};

document.getElementById("next-btn").onclick = () => {
  const url = new URL(window.location);
  url.searchParams.set("page", currentPage + 1);
  window.history.pushState({}, "", url);
  fetchProducts(currentPage + 1, document.getElementById("search-input").value);
};

const init = () => {
  const params = new URLSearchParams(window.location.search);
  const term = params.get("search") || "";
  const page = parseInt(params.get("page")) || 1;

  if (term) document.getElementById("search-input").value = term;

  fetchProducts(page, term);
};

// Determine base path based on script location to support different deployment structures
const getBasePath = () => {
    const scriptTag = document.currentScript;
    if (scriptTag && scriptTag.src) {
        // Returns the folder containing script.js (e.g., ".../FirstProject/")
        return scriptTag.src.substring(0, scriptTag.src.lastIndexOf('/') + 1);
    }
    return ''; 
};
const basePath = getBasePath();

const displayProducts = (products) => {
  container.innerHTML = products.length
    ? products
        .map(
          (p) => `
        <a href="${basePath}product.html?id=${p.id}" class="card" style="text-decoration: none; color: inherit;">
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
  window.location.href = basePath + "history.html";
};

document.getElementById("view-button").onclick = () => {
  window.location.href = basePath + "view-history.html";
};

document.getElementById("search-button").onclick = () => {
  const term = searchInput.value;
  saveHistory(term);

  const url = new URL(window.location);
  if (term) url.searchParams.set("search", term);
  else url.searchParams.delete("search");

  // Reset to page 1 for new searches
  url.searchParams.set("page", 1);
  window.history.pushState({}, "", url);

  suggestionsList.classList.add("hidden");
  fetchProducts(1, term);
};

init();
