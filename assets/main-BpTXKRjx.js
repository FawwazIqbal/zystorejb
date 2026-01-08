import"./style-LZVkCZqV.js";let d=[],s="low-to-high";async function l(){try{const o=await fetch("/products.json");if(!o.ok)throw new Error("Failed to load products");d=await o.json(),a()}catch(o){console.error("Error loading products:",o),u()}}function c(o,i){return i?Math.round(o-o*i/100):o}function a(){const o=document.getElementById("productGrid");if(d.length===0){o.innerHTML='<div class="loading">No products available</div>';return}const i=[...d].sort((t,e)=>{const n=c(t.price,t.discount),r=c(e.price,e.discount);return s==="low-to-high"?n-r:r-n});o.innerHTML=i.map(t=>{const e=c(t.price,t.discount),n=t.discount&&t.discount>0;return`
      <article class="product-card ${t.soldOut?"sold-out":""}">
        <div class="product-image-wrapper">
          <img
            src="${t.image}"
            alt="${t.name}"
            class="product-image"
            loading="lazy"
          >
          ${n?`<div class="discount-badge">-${t.discount}%</div>`:""}
        </div>
        <div class="product-info">
          <h3 class="product-name">${t.name}</h3>
          <div class="product-price">
            <span class="price-current">RM${e}</span>
            ${n?`<span class="price-original">RM${t.price}</span>`:""}
          </div>
          <button
            class="view-details-btn"
            onclick="goToProduct('${t.id}')"
            ${t.soldOut?"disabled":""}
          >
            ${t.soldOut?"Sold Out":"View Details"}
          </button>
        </div>
      </article>
    `}).join("")}function u(){const o=document.getElementById("productGrid");o.innerHTML=`
    <div class="error-message">
      <h2>Unable to Load Products</h2>
      <p>Please check your connection and try again.</p>
    </div>
  `}function g(){s=s==="low-to-high"?"high-to-low":"low-to-high";const o=document.getElementById("sortLabel");o.textContent=s==="low-to-high"?"Price: Low to High":"Price: High to Low",a()}function h(o){window.location.href=`product.html?id=${o}`}window.goToProduct=h;document.getElementById("sortButton").addEventListener("click",g);l();
