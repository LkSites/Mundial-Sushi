// =========================================
// CONFIGURAÇÃO DO WHATSAPP DA LOJA
// =========================================
// Coloque o número com DDI (55) + DDD + Número (apenas dígitos)
const WHATSAPP_NUMBER = "5511999999999";

// =========================================
// DADOS DO CARDÁPIO
// =========================================
const menuProducts = [
    {
        id: 1,
        name: "Combinado Mundial 30 Peças",
        category: "combinados",
        price: 89.90,
        badge: "Mais Pedido",
        description: "10 Sashimis de salmão, 8 Uramakis Filadélfia, 6 Hossomakis, 4 Niguiris e 2 Joes especiais.",
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        name: "Barca Premium 50 Peças",
        category: "combinados",
        price: 149.90,
        badge: "Para 2 Pessoas",
        description: "Seleção especial do chef com sashimis variados, joes maçaricados, uramakis e hot rolls.",
        image: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        name: "Temaki Salmão Completo",
        category: "temakis",
        price: 32.90,
        badge: "Clássico",
        description: "Cone de alga nori crocante recheado com salmão fresco em cubos, cream cheese e cebolinha.",
        image: "https://images.unsplash.com/photo-1617196034183-421b4917c92d?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        name: "Temaki Hot Filadélfia",
        category: "temakis",
        price: 36.90,
        badge: "Crocante",
        description: "Temaki empanado na farinha panko, frito na hora, com salmão grelhado, cream cheese e tarê.",
        image: "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 5,
        name: "Hot Roll Salmão (12 unid.)",
        category: "quentes",
        price: 34.90,
        badge: "Quente",
        description: "Sushi empanado crocante recheado com salmão e cream cheese, finalizado com molho tarê e gergelim.",
        image: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 6,
        name: "Yakisoba Clássico Misto",
        category: "quentes",
        price: 44.90,
        badge: "500g",
        description: "Macarrão oriental salteado com tiras de carne, frango, legumes selecionados e molho especial.",
        image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 7,
        name: "Refrigerante Lata 350ml",
        category: "bebidas",
        price: 6.50,
        badge: "Gelado",
        description: "Coca-Cola, Coca-Cola Zero, Guaraná Antarctica ou Sprite (informe o sabor nas observações).",
        image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 8,
        name: "H2OH! Limão 500ml",
        category: "bebidas",
        price: 8.50,
        badge: "Gelado",
        description: "Bebida levemente gaseificada sabor limão, perfeita para harmonizar com pratos orientais.",
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80"
    }
];

// =========================================
// ESTADO DO CARRINHO
// =========================================
let cart = [];

// Elementos DOM
const menuGrid = document.getElementById("menu-grid");
const filterButtons = document.querySelectorAll(".filter-btn");
const cartDrawer = document.getElementById("cart-drawer");
const cartOverlay = document.getElementById("cart-overlay");
const openCartBtn = document.getElementById("open-cart");
const closeCartBtn = document.getElementById("close-cart");
const cartItemsContainer = document.getElementById("cart-items");
const cartCountElement = document.getElementById("cart-count");
const cartTotalElement = document.getElementById("cart-total-value");
const checkoutBtn = document.getElementById("checkout-btn");
const toastElement = document.getElementById("toast");

// Menu Mobile
const mobileToggle = document.getElementById("mobile-toggle");
const closeMenuBtn = document.getElementById("close-menu");
const navMenu = document.getElementById("nav-menu");
const navLinks = document.querySelectorAll(".nav-link");

// =========================================
// RENDERIZAÇÃO DO CARDÁPIO
// =========================================
function renderMenu(category = "todos") {
    menuGrid.innerHTML = "";

    const filtered = category === "todos"
        ? menuProducts
        : menuProducts.filter(item => item.category === category);

    filtered.forEach(product => {
        const card = document.createElement("div");
        card.className = "menu-card";
        card.innerHTML = `
            <div class="menu-img-wrapper">
                <span class="menu-badge">${product.badge}</span>
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="menu-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="menu-bottom">
                    <span class="menu-price">R$ ${product.price.toFixed(2).replace(".", ",")}</span>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        <i class="fas fa-plus"></i> Adicionar
                    </button>
                </div>
            </div>
        `;
        menuGrid.appendChild(card);
    });
}

// Filtros
filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderMenu(btn.dataset.category);
    });
});

// =========================================
// FUNÇÕES DO CARRINHO
// =========================================
function addToCart(productId) {
    const product = menuProducts.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    showToast(`${product.name} adicionado!`);
}

function changeQuantity(productId, delta) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex === -1) return;

    cart[itemIndex].quantity += delta;

    if (cart[itemIndex].quantity <= 0) {
        cart.splice(itemIndex, 1);
    }

    updateCartUI();
}

function updateCartUI() {
    // Atualiza contador do ícone
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;

    // Renderiza lista
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="empty-cart-msg">Seu carrinho está vazio.<br>Escolha itens deliciosos no cardápio!</p>`;
        cartTotalElement.textContent = "R$ 0,00";
        return;
    }

    let totalValue = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalValue += itemTotal;

        const cartItemEl = document.createElement("div");
        cartItemEl.className = "cart-item";
        cartItemEl.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <span>R$ ${itemTotal.toFixed(2).replace(".", ",")}</span>
            </div>
            <div class="cart-item-controls">
                <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItemEl);
    });

    cartTotalElement.textContent = `R$ ${totalValue.toFixed(2).replace(".", ",")}`;
}

// =========================================
// FINALIZAR PEDIDO NO WHATSAPP
// =========================================
checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Adicione pelo menos um item ao carrinho antes de finalizar!");
        return;
    }

    const clientName = document.getElementById("client-name").value.trim();
    const clientAddress = document.getElementById("client-address").value.trim();
    const paymentMethod = document.getElementById("payment-method").value;
    const clientObs = document.getElementById("client-obs").value.trim();

    if (!clientName || !clientAddress) {
        alert("Por favor, preencha seu nome e endereço completo para entrega.");
        return;
    }

    let message = `*NOVO PEDIDO - MUNDIAL SUSHI BAR* 🍣\n\n`;
    message += `*Cliente:* ${clientName}\n`;
    message += `*Endereço:* ${clientAddress}\n`;
    message += `*Pagamento:* ${paymentMethod}\n`;
    if (clientObs) message += `*Observações:* ${clientObs}\n`;
    message += `\n*ITENS DO PEDIDO:*\n`;

    let total = 0;
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        message += `▪ ${item.quantity}x ${item.name} - R$ ${subtotal.toFixed(2).replace(".", ",")}\n`;
    });

    message += `\n*TOTAL: R$ ${total.toFixed(2).replace(".", ",")}*`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, "_blank");
});

// =========================================
// CONTROLES DE INTERFACE (DRAWER E MENU MOBILE)
// =========================================
function toggleCart(open) {
    cartDrawer.classList.toggle("active", open);
    cartOverlay.classList.toggle("active", open);
}

openCartBtn.addEventListener("click", () => toggleCart(true));
closeCartBtn.addEventListener("click", () => toggleCart(false));
cartOverlay.addEventListener("click", () => toggleCart(false));

mobileToggle.addEventListener("click", () => navMenu.classList.add("active"));
closeMenuBtn.addEventListener("click", () => navMenu.classList.remove("active"));
navLinks.forEach(link => {
    link.addEventListener("click", () => navMenu.classList.remove("active"));
});

function showToast(text) {
    toastElement.textContent = text;
    toastElement.classList.add("show");
    setTimeout(() => {
        toastElement.classList.remove("show");
    }, 2500);
}

// Inicialização
renderMenu();
updateCartUI();