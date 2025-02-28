class ProductManager {
  constructor() {
      this.products = [];
      this.filteredProducts = [];
      this.currentPage = 1;
      this.itemsPerPage = 8;
      this.init();
  }

  async init() {
      await this.fetchProducts();
      this.setupEventListeners();
      this.renderProducts();
      this.populateCategories();
  }

  async fetchProducts() {
      try {
          const response = await fetch('https://dummyjson.com/products');
          const data = await response.json();
          this.products = data.products;
          this.filteredProducts = [...this.products];
      } catch (error) {
          console.error('Error fetching products:', error);
      }
  }

  setupEventListeners() {
      document.getElementById('updateResults').addEventListener('click', () => this.applyFilters());
      document.getElementById('prevBtn').addEventListener('click', () => this.changePage(-1));
      document.getElementById('nextBtn').addEventListener('click', () => this.changePage(1));
  }

  applyFilters() {
      const category = document.getElementById('typeFilter').value;
      const minPrice = parseFloat(document.getElementById('lowPrice').value) || 0;
      const maxPrice = parseFloat(document.getElementById('highPrice').value) || Infinity;
      const minRating = parseFloat(document.getElementById('minRating').value) || 0;

      this.filteredProducts = this.products.filter(product => {
          return (category === 'all' || product.category === category) &&
                 product.price >= minPrice &&
                 product.price <= maxPrice &&
                 product.rating >= minRating;
      });

      this.currentPage = 1;
      this.renderProducts();
  }

  renderProducts() {
      const container = document.querySelector('.items-container');
      container.innerHTML = '';

      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      const paginatedProducts = this.filteredProducts.slice(start, end);

      paginatedProducts.forEach(product => {
          const card = document.createElement('div');
          card.className = 'item-card';
          card.innerHTML = `
              <img src="${product.thumbnail}" alt="${product.title}">
              <div class="card-body">
                  <h3>${product.title}</h3>
                  <p class="description">${product.description.slice(0, 80)}...</p>
                  <div class="price-rating">
                      <span class="price">$${product.price.toFixed(2)}</span>
                      <span class="rating">★ ${product.rating}</span>
                  </div>
              </div>
          `;
          card.addEventListener('click', () => {
              window.location.href = `detail.html?id=${product.id}`;
          });
          container.appendChild(card);
      });

      this.updatePagination();
  }

  populateCategories() {
      const categories = [...new Set(this.products.map(product => product.category))];
      const filter = document.getElementById('typeFilter');
      categories.forEach(category => {
          const option = document.createElement('option');
          option.value = category;
          option.textContent = category;
          filter.appendChild(option);
      });
  }

  changePage(direction) {
      this.currentPage += direction;
      this.renderProducts();
  }

  updatePagination() {
      const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
      document.getElementById('pageIndicator').textContent = `${this.currentPage}/${totalPages}`;
      document.getElementById('prevBtn').disabled = this.currentPage === 1;
      document.getElementById('nextBtn').disabled = this.currentPage === totalPages;
  }
}

const productManager = new ProductManager();