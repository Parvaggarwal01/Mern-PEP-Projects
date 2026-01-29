let allProducts = [];

      async function fetchProducts() {
        try {
          const response = await fetch("https://dummyjson.com/products");
          const data = await response.json();
          allProducts = data.products;
          displayProducts(allProducts);
        } catch (error) {
          console.error("Error fetching products:", error);
          document.getElementById("product-container").innerHTML =
            "<p>Error loading products.</p>";
        }
      }

      function displayProducts(products) {
        const container = document.getElementById("product-container");
        container.innerHTML = "";

        if (products.length === 0) {
          container.innerHTML = "<p>No products found.</p>";
          return;
        }

        products.forEach((product) => {
          const card = document.createElement("div");
          card.className = "card";

          const imageContainer = document.createElement("div");
          imageContainer.className = "card-image-container";

          const img = document.createElement("img");
          img.src = product.thumbnail;
          img.alt = product.title;
          img.loading = "lazy";

          imageContainer.appendChild(img);

          const title = document.createElement("h2");
          title.className = "card-title";
          title.textContent = product.title;

          const price = document.createElement("div");
          price.className = "card-price";
          price.textContent = `$${product.price}`;

          card.appendChild(imageContainer);
          card.appendChild(title);
          card.appendChild(price);

          container.appendChild(card);
        });
      }

      document.getElementById("search-input").addEventListener("input", (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredProducts = allProducts.filter((product) =>
          product.title.toLowerCase().includes(searchTerm),
        );
        displayProducts(filteredProducts);
      });

      fetchProducts();