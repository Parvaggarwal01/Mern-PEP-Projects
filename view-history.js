function loadHistory() {
  const container = document.getElementById("history-container");
  let history = JSON.parse(localStorage.getItem("viewHistory") || "[]");

  if (history.length === 0) {
    container.innerHTML =
      '<p style="padding: 20px; text-align: center;">No view history found.</p>';
    return;
  }

  container.innerHTML = history
    .map((item) => {
      if (!item.id) return ""; // Skip invalid items
      return `
            <a href="product.html?id=${item.id}" class="history-item">
                <span class="history-term">${item.title}</span>
                <span class="history-time">${item.timestamp}</span>
            </a>
        `;
    })
    .join("");
}

function clearHistory() {
  localStorage.removeItem("viewHistory");
  loadHistory();
}

loadHistory();
