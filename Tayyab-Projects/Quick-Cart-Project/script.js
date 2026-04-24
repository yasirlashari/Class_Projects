const products = [
  {
    id: 1,
    name: "Perfumes",
    price: 25,
    image:
      "https://i.pinimg.com/736x/9c/b2/5b/9cb25b1f0ed06b93ddf9689dd39ca0cf.jpg",
  },
  {
    id: 2,
    name: "Polo T-Shirt",
    price: 30,
    image:
      "https://tse3.mm.bing.net/th/id/OIP.RLGEOTBNCsd7_HUxGzPjjQHaIr?rs=1&pid=ImgDetMain&o=7&rm=3",
  },
  {
    id: 3,
    name: "Formal Shirt",
    price: 20,
    image:
      "https://tse3.mm.bing.net/th/id/OIP.uGYkmMlMKarOtbOvRQko_wHaE4?rs=1&pid=ImgDetMain&o=7&rm=3",
  },
  {
    id: 4,
    name: "Sports Wear",
    price: 25,
    image:
      "https://th.bing.com/th/id/OIP.h-rpfiQiN9vLrJzKEfwBHwHaE7?w=298&h=199&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3",
  },
  {
    id: 5,
    name: "Sneakers",
    price: 15,
    image:
      "https://onedegree.com.pk/cdn/shop/files/001_0003_009593984-749-42_up_jpg_1.jpg?v=1773400763&width=640",
  },
  {
    id: 6,
    name: "Toys",
    price: 5,
    image:
      "https://www.telegraph.co.uk/content/dam/recommended/2024/09/25/TELEMMGLPICT000395471929_17272789739160_trans_NvBQzQNjv4BqqVzuuqpFlyLIwiB6NTmJwfSVWeZ_vEN7c6bHu2jJnT8.jpeg?imwidth=640",
  },
  {
    id: 7,
    name: "Tablets",
    price: 200,
    image:
      "https://i5.walmartimages.com/seo/Lenovo-Tab-M10-Plus-2022-10-FHD-Long-Battery-Life-Tablet-128GB-Android-Storm-Grey_6d20d86e-e339-4dea-a97d-788dbf71f08c.50da7e377a5410315db7b2430fc13a86.png",
  },
  {
    id: 8,
    name: "Snacks",
    price: 5,
    image:
      "https://oldfashioncandy.com/wp-content/uploads/2014/07/Mega-Variety-25-1-e1720019542149.jpeg",
  },
  {
    id: 9,
    name: "Dumble",
    price: 15,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQPd9rxSyLvQEvW8TqQ6T_5Z5xhyeKFoUnAw&s",
  },
  {
    id: 10,
    name: "Kitchen Accessories",
    price: 10,
    image:
      "https://www.allinonestore.pk/cdn/shop/files/12-pcs-silicone-cooking-utensils-set-933819.webp?v=1755460541",
  },
  {
    id: 11,
    name: "School Accessories Set",
    price: 15,
    image:
      "https://img.freepik.com/free-vector/school-student-stationary-supplies-shelf_3446-469.jpg",
  },
  {
    id: 12,
    name: "Bag",
    price: 50,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtgRHUdIrtzyTBeNc54Q_W-6RvqY5r52KsVw&s",
  },
];
const WHATSAPP_NUMBER = "923213118485";

let cart = JSON.parse(localStorage.getItem("qc_cart")) || [];

function saveCart() {
    localStorage.setItem("qc_cart", JSON.stringify(cart));
}
function renderProducts(containerId, list) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";

    list.forEach(p => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
      <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'"/>
      <div class="product-card-body">
        <h3>${p.name}</h3>
        <div class="price">$${p.price}</div>
        <button class="add-cart-btn" id="btn-${p.id}" onclick="addToCart(${p.id})">
          🛒 Add to Cart
        </button>
      </div>
    `;
        container.appendChild(card);
    });
}
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    saveCart();
    updateCartUI();
    showToast(`✅ ${product.name} cart mein add ho gaya!`);
    const btn = document.getElementById(`btn-${productId}`);
    if (btn) {
        btn.textContent = "✓ Added!";
        btn.classList.add("added");
        setTimeout(() => {
            btn.textContent = "🛒 Add to Cart";
            btn.classList.remove("added");
        }, 1500);
    }
}
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    renderCartItems();
}
function updateQty(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        removeFromCart(productId);
        return;
    }
    saveCart();
    updateCartUI();
    renderCartItems();
}
function clearCart() {
    if (!confirm("Kya aap cart clear karna chahte hain?")) return;
    cart = [];
    saveCart();
    updateCartUI();
    renderCartItems();
    showToast("🗑️ Cart clear ho gaya!");
}
function renderCartItems() {
    const body = document.getElementById("cartBody");
    const empty = document.getElementById("cartEmpty");
    const footer = document.getElementById("cartFooter");
    const totalEl = document.getElementById("cartTotal");
    if (!body) return;
    body.querySelectorAll(".cart-item").forEach(el => el.remove());

    if (cart.length === 0) {
        if (empty) empty.style.display = "block";
        if (footer) footer.style.display = "none";
        return;
    }

    if (empty) empty.style.display = "none";
    if (footer) footer.style.display = "flex";

    const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    if (totalEl) totalEl.textContent = `$${total}`;

    cart.forEach(item => {
        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
      <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/60?text=?'"/>
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <span>$${item.price * item.qty}</span>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="updateQty(${item.id}, -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
        </div>
      </div>
      <button class="remove-btn" onclick="removeFromCart(${item.id})" title="Remove">🗑️</button>
    `;
        body.appendChild(div);
    });
}
function updateCartUI() {
    const total = cart.reduce((sum, i) => sum + i.qty, 0);
    document.querySelectorAll("#cartBadge").forEach(el => {
        el.textContent = total;
    });
    renderCartItems();
}
function toggleCart() {
    const sidebar = document.getElementById("cartSidebar");
    const overlay = document.getElementById("cartOverlay");
    if (!sidebar) return;
    const isOpen = sidebar.classList.contains("open");
    sidebar.classList.toggle("open", !isOpen);
    if (overlay) overlay.classList.toggle("show", !isOpen);
}
function orderOnWhatsApp() {
    if (cart.length === 0) {
        showToast("⚠️ Cart khali hai! Pehle kuch add karo.");
        return;
    }

    const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

    let msg = "🛒 *QuickCart - Naya Order!*\n";
    msg += "━━━━━━━━━━━━━━━━━\n\n";

    cart.forEach((item, i) => {
        msg += `${i + 1}. *${item.name}*\n`;
        msg += `   Qty: ${item.qty} × $${item.price} = *$${item.price * item.qty}*\n\n`;
    });

    msg += "━━━━━━━━━━━━━━━━━\n";
    msg += `💰 *Total Amount: $${total}*\n\n`;
    msg += "📍 Please apna address bhi batain.\nShukriya! 🙏";

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
}
function showToast(msg) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2800);
}
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        const sidebar = document.getElementById("cartSidebar");
        const overlay = document.getElementById("cartOverlay");
        if (sidebar && sidebar.classList.contains("open")) {
            sidebar.classList.remove("open");
            if (overlay) overlay.classList.remove("show");
        }
    }
});