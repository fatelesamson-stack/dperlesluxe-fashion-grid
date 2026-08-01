// ============================================================
// PRODUCT DATABASE - Add your products here
// ============================================================
const products = [
    { 
        id: 1, 
        name: 'Royal Classic Agbada', 
        category: 'classic', 
        price: 85000, 
        originalPrice: 95000, 
        sizes: ['S','M','L','XL','XXL'], 
        badge: 'Best Seller', 
        inStock: true, 
        description: 'Premium hand-stitched royal agbada with intricate embroidery' 
    },
    { 
        id: 2, 
        name: 'Modern Stitch Agbada', 
        category: 'modern', 
        price: 75000, 
        originalPrice: null, 
        sizes: ['M','L','XL'], 
        badge: null, 
        inStock: true, 
        description: 'Contemporary design with clean modern lines' 
    },
    { 
        id: 3, 
        name: 'Embroidered Luxe Agbada', 
        category: 'embroidery', 
        price: 120000, 
        originalPrice: 140000, 
        sizes: ['L','XL','XXL'], 
        badge: 'Premium', 
        inStock: true, 
        description: 'Luxurious embroidery work with gold thread accents' 
    },
    { 
        id: 4, 
        name: 'Classic Kaftan Agbada', 
        category: 'classic', 
        price: 65000, 
        originalPrice: null, 
        sizes: ['S','M','L','XL'], 
        badge: null, 
        inStock: true, 
        description: 'Timeless kaftan style with elegant draping' 
    },
    { 
        id: 5, 
        name: 'Embroidered Floral Agbada', 
        category: 'embroidery', 
        price: 135000, 
        originalPrice: 155000, 
        sizes: ['M','L','XL','XXL'], 
        badge: 'Limited', 
        inStock: true, 
        description: 'Unique floral embroidery pattern - limited collection' 
    },
    { 
        id: 6, 
        name: 'Modern Navy Agbada', 
        category: 'modern', 
        price: 82000, 
        originalPrice: null, 
        sizes: ['S','M','L','XL'], 
        badge: null, 
        inStock: true, 
        description: 'Rich navy blue fabric with subtle modern stitching' 
    }
];

// ============================================================
// WHATSAPP CONFIGURATION
// ============================================================
// 🔴 REPLACE WITH YOUR WHATSAPP NUMBER (Country code + number, no + sign)
// Example: 2348138586051 for Nigeria
const WHATSAPP_NUMBER = '09153328922';

// ============================================================
// STATE
// ============================================================
let cart = [];
let currentFilter = 'all';
let registeredUsers = JSON.parse(localStorage.getItem('dperlesluxe_users')) || [];
let currentUser = JSON.parse(localStorage.getItem('dperlesluxe_current_user')) || null;

// ============================================================
// DOM REFS
// ============================================================
const productGrid = document.getElementById('productGrid');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const placeOrderBtn = document.getElementById('placeOrderBtn');
const navLinks = document.getElementById('navLinks');
const hamburger = document.getElementById('hamburger');

// ============================================================
// TOAST NOTIFICATION
// ============================================================
function showToast(message, type = 'info') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 3500);
}

// ============================================================
// RENDER PRODUCTS
// ============================================================
function renderProducts(filter = 'all') {
    const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);

    if (filtered.length === 0) {
        productGrid.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:60px 0;color:var(--primary-light);">
                <i class="fas fa-box-open" style="font-size:3rem;display:block;margin-bottom:16px;"></i>
                <p>No products in this category yet.</p>
            </div>
        `;
        return;
    }

    productGrid.innerHTML = filtered.map(product => {
        const sizesHTML = product.sizes.map(size =>
            `<button class="size-option" data-size="${size}">${size}</button>`
        ).join('');

        const badgeHTML = product.badge ? `<span class="badge">${product.badge}</span>` : '';
        const originalPriceHTML = product.originalPrice ? `<span>₦${product.originalPrice.toLocaleString()}</span>` : '';

        return `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image" style="background:linear-gradient(135deg, var(--primary-light), var(--primary));">
                    <i class="fas fa-tshirt" style="font-size:4rem;opacity:0.5;"></i>
                    ${badgeHTML}
                </div>
                <div class="product-body">
                    <h3>${product.name}</h3>
                    <div class="category">${product.category}</div>
                    <p style="font-size:0.85rem;color:var(--primary-light);margin:4px 0 8px;">${product.description}</p>
                    <div class="price">
                        ₦${product.price.toLocaleString()}
                        ${originalPriceHTML}
                    </div>
                    <div class="size-select">
                        <label>Select Size:</label>
                        ${sizesHTML}
                    </div>
                    <button class="btn-primary btn-small add-to-cart" data-id="${product.id}">
                        <i class="fas fa-cart-plus"></i> Add to Order
                    </button>
                </div>
            </div>
        `;
    }).join('');

    document.querySelectorAll('.size-option').forEach(btn => {
        btn.addEventListener('click', function() {
            const parent = this.closest('.size-select');
            parent.querySelectorAll('.size-option').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.product-card');
            const id = parseInt(this.dataset.id);
            const sizeSelected = card.querySelector('.size-option.selected');
            const size = sizeSelected ? sizeSelected.dataset.size : null;

            if (!size) {
                showToast('Please select a size first!', 'error');
                return;
            }

            const product = products.find(p => p.id === id);
            addToCart(product, size);
        });
    });
}

// ============================================================
// CART FUNCTIONS
// ============================================================
function addToCart(product, size) {
    const existing = cart.find(item => item.id === product.id && item.size === size);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, size, quantity: 1 });
    }
    updateCart();
    showToast(`✅ ${product.name} (${size}) added to order!`, 'success');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function updateCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = `<p class="empty-cart">Your cart is empty.</p>`;
        cartTotal.textContent = '₦0';
        cartCount.textContent = '0';
        return;
    }

    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <span>
                <span class="item-name">${item.name}</span>
                <span class="item-size">(${item.size})</span>
                <span style="font-size:0.8rem;color:var(--primary-light);margin-left:4px;">×${item.quantity}</span>
            </span>
            <span>
                <span class="item-price">₦${(item.price * item.quantity).toLocaleString()}</span>
                <button onclick="removeFromCart(${index})" style="background:none;border:none;color:#b33c3c;cursor:pointer;margin-left:10px;font-size:0.9rem;">
                    <i class="fas fa-times"></i>
                </button>
            </span>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `₦${total.toLocaleString()}`;
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalQty;
}

// ============================================================
// WHATSAPP ORDER FUNCTION
// ============================================================
function sendOrderToWhatsApp() {
    if (cart.length === 0) {
        showToast('Your cart is empty!', 'error');
        return;
    }

    if (!currentUser) {
        showToast('Please sign in or register first!', 'error');
        document.getElementById('signin').scrollIntoView({ behavior: 'smooth' });
        return;
    }

    const orderItems = cart.map(item =>
        `• ${item.name} (Size: ${item.size}) × ${item.quantity} = ₦${(item.price * item.quantity).toLocaleString()}`
    ).join('\n');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const message = `🛍️ *NEW ORDER FROM D'PERLESLUXE!*

━━━━━━━━━━━━━━━━━━━━━━
👤 *Customer Details:*
• Name: ${currentUser.name}
• Email: ${currentUser.email}
• Phone: ${currentUser.phone}
• Location: ${currentUser.location || 'F01 Market, Abuja'}

━━━━━━━━━━━━━━━━━━━━━━
📦 *Order Details:*
${orderItems}

━━━━━━━━━━━━━━━━━━━━━━
💰 *Total: ₦${total.toLocaleString()}*

━━━━━━━━━━━━━━━━━━━━━━
📅 Date: ${new Date().toLocaleString()}
📍 Source: D'perlesluxe Website

Thank you for your order! 🙏`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    window.open(whatsappURL, '_blank');

    cart = [];
    updateCart();
    showToast('📱 Opening WhatsApp... Send the message to place your order!', 'success');

    setTimeout(() => {
        document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
    }, 500);
}

// ============================================================
// REGISTRATION
// ============================================================
function handleRegister(e) {
    e.preventDefault();

    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const password = document.getElementById('regPassword').value;
    const location = document.getElementById('regLocation').value.trim() || 'F01 Market, Abuja';

    if (!name || !email || !phone || password.length < 6) {
        showToast('Please fill all fields correctly (password min 6 chars)', 'error');
        return;
    }

    if (registeredUsers.find(u => u.email === email)) {
        showToast('User with this email already exists!', 'error');
        return;
    }

    const user = { name, email, phone, password, location };
    registeredUsers.push(user);
    localStorage.setItem('dperlesluxe_users', JSON.stringify(registeredUsers));

    currentUser = { name, email, phone, location };
    localStorage.setItem('dperlesluxe_current_user', JSON.stringify(currentUser));

    showToast(`Welcome, ${name}! Registration successful.`, 'success');
    document.getElementById('registerForm').reset();

    updateNavForUser();
    document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
}

// ============================================================
// SIGN IN
// ============================================================
function handleSignIn(e) {
    e.preventDefault();

    const email = document.getElementById('signinEmail').value.trim();
    const password = document.getElementById('signinPassword').value;

    const user = registeredUsers.find(u => u.email === email && u.password === password);

    if (!user) {
        showToast('Invalid email or password!', 'error');
        return;
    }

    currentUser = { name: user.name, email: user.email, phone: user.phone, location: user.location };
    localStorage.setItem('dperlesluxe_current_user', JSON.stringify(currentUser));

    showToast(`Welcome back, ${user.name}!`, 'success');
    document.getElementById('signinForm').reset();

    updateNavForUser();
    document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
}

// ============================================================
// SIGN OUT
// ============================================================
function signOut() {
    currentUser = null;
    localStorage.removeItem('dperlesluxe_current_user');
    updateNavForUser();
    showToast('👋 You have been signed out successfully.', 'info');
    document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
}

// ============================================================
// UPDATE NAV
// ============================================================
function updateNavForUser() {
    const navLinksContainer = document.getElementById('navLinks');
    
    const existingGreeting = navLinksContainer.querySelector('.user-greeting');
    if (existingGreeting) existingGreeting.remove();

    if (currentUser) {
        const greeting = document.createElement('li');
        greeting.className = 'user-greeting';
        greeting.innerHTML = `
            <span>👤 ${currentUser.name}</span>
            <button class="signout-btn" onclick="signOut()">
                <i class="fas fa-sign-out-alt"></i> Sign Out
            </button>
        `;
        
        const signInLink = navLinksContainer.querySelector('a[href="#signin"]')?.closest('li');
        if (signInLink) {
            navLinksContainer.insertBefore(greeting, signInLink);
        } else {
            navLinksContainer.appendChild(greeting);
        }
    }
}

// ============================================================
// FLOATING WHATSAPP BUTTON
// ============================================================
function addWhatsAppFloatButton() {
    const floatBtn = document.createElement('a');
    floatBtn.href = `https://wa.me/${09153328922}`;
    floatBtn.target = '_blank';
    floatBtn.className = 'whatsapp-float';
    floatBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
    floatBtn.setAttribute('aria-label', 'Chat on WhatsApp');
    document.body.appendChild(floatBtn);
}

// ============================================================
// EVENT LISTENERS
// ============================================================
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentFilter = this.dataset.filter;
        renderProducts(currentFilter);
    });
});

placeOrderBtn.addEventListener('click', sendOrderToWhatsApp);

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
    });
});

document.getElementById('registerForm').addEventListener('submit', handleRegister);
document.getElementById('signinForm').addEventListener('submit', handleSignIn);

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

// ============================================================
// INIT
// ============================================================
renderProducts('all');
updateCart();
updateNavForUser();
addWhatsAppFloatButton();

if (currentUser) {
    showToast(`Welcome back, ${currentUser.name}!`, 'info');
}

console.log('🚀 D\'perlesluxe Fashion Grid is ready!');
console.log(`📦 ${products.length} products loaded`);
console.log(`👥 ${registeredUsers.length} registered users`);
console.log(`📱 WhatsApp: ${WHATSAPP_NUMBER}`);