// ============================================================
// EAGLE STORE — site logic
// Products are loaded from products.json so the catalog can be
// edited without touching any code.
// ============================================================

const FALLBACK_IMG = "https://placehold.co/800x500/EFEBF5/635F69?text=Imej+tidak+tersedia";

let STORE = { config: {}, products: [] };
let activeRankFilter = "";
let activeSearch = "";

const productGrid = document.getElementById("productGrid");
const emptyState = document.getElementById("emptyState");
const rankFilter = document.getElementById("rankFilter");
const searchInput = document.getElementById("searchInput");

init();

async function init() {
  await loadProducts();
  wireWhatsappLinks();
  populateRankFilter();
  renderProducts();
  wireFilters();
  wireNav();
  wireFaq();
}

async function loadProducts() {
  try {
    const res = await fetch("products.json", { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    STORE = await res.json();
  } catch (err) {
    console.error("Could not load products.json:", err);
    productGrid.innerHTML = `
      <p style="grid-column:1/-1;text-align:center;font-weight:700;max-width:52ch;margin:0 auto;">
        Tidak dapat memuatkan products.json. Jika anda membuka fail ini terus
        (file://), pelayar menyekat permintaan JSON tempatan — jalankan
        pelayan tempatan ringkas seperti <code>npx serve</code> atau
        <code>python3 -m http.server</code>, atau muat naik folder ini ke
        mana-mana hosting statik (Vercel, Netlify, GitHub Pages).
      </p>`;
    STORE = { config: { whatsappNumber: "601165266140", whatsappDisplay: "+60 11-6526 6140" }, products: [] };
  }
}

function waLink(product) {
  const number = STORE.config.whatsappNumber || "601165266140";
  const base = `Hai Eagle Store! Saya berminat dengan "${product ? product.name : ""}"${product ? " (" + product.price + ")" : ""}. Masih ada stok?`;
  const text = product ? base : "Hai Eagle Store! Saya nak tanya pasal akaun MLBB anda.";
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

function wireWhatsappLinks() {
  ["navWhatsapp", "heroWhatsapp", "footerWhatsapp", "floatWhatsapp"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.href = waLink(null);
  });
  const display = document.getElementById("footerWhatsapp");
  if (display && STORE.config.whatsappDisplay) {
    display.textContent = "💬 " + STORE.config.whatsappDisplay;
  }
}

function populateRankFilter() {
  const ranks = [...new Set(STORE.products.map((p) => p.rank))];
  ranks.forEach((rank) => {
    const opt = document.createElement("option");
    opt.value = rank;
    opt.textContent = rank;
    rankFilter.appendChild(opt);
  });
}

function wireFilters() {
  searchInput.addEventListener("input", (e) => {
    activeSearch = e.target.value.trim().toLowerCase();
    renderProducts();
  });
  rankFilter.addEventListener("change", (e) => {
    activeRankFilter = e.target.value;
    renderProducts();
  });
}

function getFilteredProducts() {
  return STORE.products.filter((p) => {
    const matchesRank = !activeRankFilter || p.rank === activeRankFilter;
    const haystack = (p.name + " " + p.rank).toLowerCase();
    const matchesSearch = !activeSearch || haystack.includes(activeSearch);
    return matchesRank && matchesSearch;
  });
}

function renderProducts() {
  const list = getFilteredProducts();
  productGrid.innerHTML = "";
  emptyState.hidden = list.length !== 0;

  list.forEach((product) => {
    productGrid.appendChild(buildProductCard(product));
  });
}

function buildProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card clay-card";
  card.dataset.id = product.id;

  card.innerHTML = `
    <div class="carousel" data-role="carousel">
      <div class="product-badges">
        <span class="badge badge-rank">${escapeHtml(product.rank)}</span>
        ${product.badge ? `<span class="badge badge-status${product.sold ? " sold" : ""}">${escapeHtml(product.badge)}</span>` : "<span></span>"}
      </div>
      <div class="carousel-track" data-role="track">
        ${product.images.map((src) => `<img src="${escapeAttr(src)}" alt="Tangkapan skrin ${escapeAttr(product.name)}" loading="lazy" onerror="this.src='${FALLBACK_IMG}'">`).join("")}
      </div>
      ${product.images.length > 1 ? `
        <button class="carousel-arrow prev" type="button" aria-label="Imej sebelumnya">‹</button>
        <button class="carousel-arrow next" type="button" aria-label="Imej seterusnya">›</button>
        <div class="carousel-dots">
          ${product.images.map((_, i) => `<button type="button" aria-label="Imej ${i + 1}" class="${i === 0 ? "active" : ""}"></button>`).join("")}
        </div>` : ""}
    </div>
    <div class="product-body">
      <h3 class="h3-card">${escapeHtml(product.name)}</h3>
      <div class="product-specs">
        <span>🖥️ ${escapeHtml(product.server)}</span>
        <span>🦸 ${product.heroCount} hero</span>
        <span>🎨 ${product.skinCount} skin</span>
      </div>
      <p class="product-desc">${escapeHtml(product.description)}</p>
      <div class="product-price">${escapeHtml(product.price)}</div>
      <a href="${product.sold ? "#" : waLink(product)}" target="_blank" rel="noopener"
         class="btn btn-whatsapp" ${product.sold ? 'aria-disabled="true" tabindex="-1"' : ""}>
        ${product.sold ? "Telah Terjual" : "💬 Pesan melalui WhatsApp"}
      </a>
    </div>
  `;

  setupCarousel(card, product);
  return card;
}

function setupCarousel(card, product) {
  const track = card.querySelector('[data-role="track"]');
  const prev = card.querySelector(".carousel-arrow.prev");
  const next = card.querySelector(".carousel-arrow.next");
  const dots = card.querySelectorAll(".carousel-dots button");
  let index = 0;

  function go(i) {
    index = (i + product.images.length) % product.images.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, di) => d.classList.toggle("active", di === index));
  }

  if (prev) prev.addEventListener("click", (e) => { e.stopPropagation(); go(index - 1); });
  if (next) next.addEventListener("click", (e) => { e.stopPropagation(); go(index + 1); });
  dots.forEach((dot, i) => dot.addEventListener("click", (e) => { e.stopPropagation(); go(i); }));
}

// ---------- FAQ ----------
function wireFaq() {
  document.querySelectorAll(".faq-item").forEach((item) => {
    const btn = item.querySelector(".faq-question");
    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach((o) => {
        o.classList.remove("open");
        o.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });
}

// ---------- Nav ----------
function wireNav() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

// ---------- Utils ----------
function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}
function escapeAttr(str) {
  return escapeHtml(str);
}
