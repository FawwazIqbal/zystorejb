import"./style-LZVkCZqV.js";const c="601123880902";function r(){return new URLSearchParams(window.location.search).get("id")}function d(t,e){return e?Math.round(t-t*e/100):t}async function l(){const t=r();if(!t){o("No product ID provided");return}try{const e=await fetch("/products.json");if(!e.ok)throw new Error("Failed to load products");const i=(await e.json()).find(a=>a.id===t);if(!i){o("Product not found");return}u(i),p(i.name)}catch(e){console.error("Error loading product:",e),o("Unable to load product details")}}function u(t){const e=document.getElementById("productDetail"),n=d(t.price,t.discount),i=t.discount&&t.discount>0,a=t.features&&t.features.length>0?`
      <div class="product-features">
        <h3 class="features-title">What's Included</h3>
        <ul class="features-list">
          ${t.features.map(s=>`<li>${s}</li>`).join("")}
        </ul>
      </div>
    `:"";e.innerHTML=`
    <article class="product-detail">
      <img
        src="${t.image}"
        alt="${t.name}"
        class="product-detail-image"
      >
      <div class="product-detail-content">
        <div class="product-detail-header">
          <h2 class="product-detail-title">${t.name}</h2>
          <div class="product-detail-price">
            ${i?`<div class="detail-discount-badge">-${t.discount}% OFF</div>`:""}
            ${i?`<div class="detail-price-original">RM${t.price}</div>`:""}
            <div class="detail-price-current">RM${n}</div>
          </div>
        </div>

        <p class="product-detail-description">${t.description}</p>

        ${a}

        <button
          class="buy-button"
          onclick="buyProduct('${t.name}', ${n})"
          ${t.soldOut?"disabled":""}
        >
          <i class="ri-whatsapp-line" style="font-size: 1.5rem;"></i>
          ${t.soldOut?"Sold Out":"Contact Now"}
        </button>
      </div>
    </article>
  `}function o(t){const e=document.getElementById("productDetail");e.innerHTML=`
    <div class="error-message">
      <h2><i class="ri-error-warning-line"></i> Error</h2>
      <p>${t}</p>
      <a href="index.html" class="view-details-btn" style="display: inline-block; text-decoration: none; margin-top: 1rem;">
        Back to Shop
      </a>
    </div>
  `}function p(t){document.title=`${t} - ZYSTORE`}function m(t,e){const n=`Hi, Saya berminat dengan acc: ${t} – RM${e}`,i=encodeURIComponent(n),a=`https://wa.me/${c}?text=${i}`;window.open(a,"_blank")}window.buyProduct=m;l();
