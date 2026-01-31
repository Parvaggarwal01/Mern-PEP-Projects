function loadHistory() {
  const container = document.getElementById("history-container");
  let history = JSON.parse(localStorage.getItem("searchHistory") || "[]");

  if (history.length === 0) {
    container.innerHTML =
      '<p style="padding: 20px; text-align: center;">No history found.</p>';
    return;
  }

  if (typeof history[0] === "string") {
    history = history.map((term) => ({ term, timestamp: "Unknown" }));
  }

  container.innerHTML = history
    .map(
      (item) => `
            <a href="index.html?search=${item.term}" class="history-item">
                <span class="history-term">${item.term}</span>
                <span class="history-time">${item.timestamp}</span>
            </a>
        `,
    )
    .join("");
}

function clearHistory() {
  localStorage.removeItem("searchHistory");
  loadHistory();
}

loadHistory();
