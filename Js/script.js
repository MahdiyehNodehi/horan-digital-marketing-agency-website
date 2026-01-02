// ELEMENTS
const cards = document.getElementById("cards");
const pages = document.getElementById("pages");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const priceRange = document.getElementById("priceRange");
const priceValue = document.getElementById("priceValue");
const searchInput = document.getElementById("searchInput");
const categoryItems = document.querySelectorAll(".category-item");

// DATA
let data = [];
let filtered = [];
let currentPage = 1;
const perPage = 6;

// FETCH JSON DATA
fetch("/data/cards.json")
  .then(res => res.json())
  .then(json => {
    data = json;
    filtered = [...data];
    render();
  })
  .catch(err => console.error("Error loading JSON:", err));

// RENDER CARDS
function render() {
  cards.innerHTML = "";
  const start = (currentPage - 1) * perPage;
  const items = filtered.slice(start, start + perPage);

  items.forEach(item => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <img src="${item.img}" alt="${item.title}">
      <div class="card-body">
        <h3>${item.title}</h3>
        <span class="price">$${item.price}</span>
      </div>
    `;
    cards.appendChild(div);
  });

  renderPagination();
}

// PAGINATION
function renderPagination() {
  pages.innerHTML = "";
  const pageCount = Math.ceil(filtered.length / perPage);

  for (let i = 1; i <= pageCount; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.classList.toggle("active", i === currentPage);
    btn.onclick = () => {
      currentPage = i;
      render();
    };
    pages.appendChild(btn);
  }
}

prevBtn.onclick = () => {
  if (currentPage > 1) currentPage--;
  render();
};

nextBtn.onclick = () => {
  if (currentPage < Math.ceil(filtered.length / perPage)) currentPage++;
  render();
};

// CATEGORY FILTER
categoryItems.forEach(item => {
  item.addEventListener("click", () => {
    categoryItems.forEach(i => i.classList.remove("active"));
    item.classList.add("active");

    const cat = item.dataset.category;
    filtered = cat === "all" ? [...data] : data.filter(i => i.category === cat);
    currentPage = 1;
    render();
  });
});

// PRICE FILTER
priceRange.oninput = () => {
  priceValue.textContent = `$${priceRange.value}`;
  filtered = data.filter(i => i.price <= priceRange.value);
  currentPage = 1;
  render();
};

// SEARCH FILTER
searchInput.oninput = () => {
  const q = searchInput.value.toLowerCase();
  filtered = data.filter(i => i.title.toLowerCase().includes(q));
  currentPage = 1;
  render();
};
