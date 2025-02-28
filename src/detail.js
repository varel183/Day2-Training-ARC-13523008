document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (!productId) {
      document.querySelector(".item-detail").innerHTML = "<p>Product not found.</p>";
      return;
  }

  try {
      const response = await fetch(`https://dummyjson.com/products/${productId}`);
      const product = await response.json();
      displayProductDetails(product);
  } catch (error) {
      console.error("Error fetching product details:", error);
  }
});

function displayProductDetails(product) {
  document.getElementById("featuredImage").src = product.thumbnail;
  document.getElementById("itemBrand").textContent = product.brand;
  document.getElementById("itemTitle").textContent = product.title;
  document.getElementById("itemPrice").textContent = `$${product.price.toFixed(2)}`;
  document.getElementById("ratingValue").textContent = product.rating.toFixed(1);
  document.getElementById("reviewCount").textContent = `(${product.stock} reviews)`;
  document.getElementById("itemCategory").textContent = product.category;
  document.getElementById("stockStatus").textContent = product.stock > 0 ? "In Stock" : "Out of Stock";
  document.getElementById("itemDescription").textContent = product.description;

  renderStars(product.rating);
}

function renderStars(rating) {
  const starContainer = document.getElementById("ratingStars");
  starContainer.innerHTML = '';
  
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  for (let i = 0; i < 5; i++) {
      const star = document.createElement('span');
      star.className = 'star';
      
      if (i < fullStars) {
          star.textContent = '★';
          star.classList.add('full-star');
      } else if (hasHalfStar && i === fullStars) {
          star.textContent = '★';
          star.classList.add('half-star');
      } else {
          star.textContent = '☆';
          star.classList.add('empty-star');
      }
      
      starContainer.appendChild(star);
  }
}