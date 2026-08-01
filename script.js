// ============================================================
// STEP 1: PRODUCT DATABASE
// ============================================================
// 📌 IMPORTANT: Add ALL your Agbada products here!
// To add a new product, copy the template below and fill in your details.
// ============================================================

const products = [
    // Product 1
    {
        id: 1,
        name: 'Royal Classic Agbada',
        category: 'classic',
        price: 85000,
        originalPrice: 95000,  // Set to null if no discount
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        badge: 'Best Seller',  // Set to null if no badge
        image: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400',
        inStock: true,
        description: 'Premium hand-stitched royal agbada with intricate embroidery'
    },
    
    // Product 2
    {
        id: 2,
        name: 'Modern Stitch Agbada',
        category: 'modern',
        price: 75000,
        originalPrice: null,
        sizes: ['M', 'L', 'XL'],
        badge: null,
        image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400',
        inStock: true,
        description: 'Contemporary design with clean modern lines'
    },
    
    // Product 3
    {
        id: 3,
        name: 'Embroidered Luxe Agbada',
        category: 'embroidery',
        price: 120000,
        originalPrice: 140000,
        sizes: ['L', 'XL', 'XXL'],
        badge: 'Premium',
        image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400',
        inStock: true,
        description: 'Luxurious embroidery work with gold thread accents'
    },
    
    // Product 4
    {
        id: 4,
        name: 'Classic Kaftan Agbada',
        category: 'classic',
        price: 65000,
        originalPrice: null,
        sizes: ['S', 'M', 'L', 'XL'],
        badge: null,
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400',
        inStock: true,
        description: 'Timeless kaftan style with elegant draping'
    },
    
    // Product 5
    {
        id: 5,
        name: 'Embroidered Floral Agbada',
        category: 'embroidery',
        price: 135000,
        originalPrice: 155000,
        sizes: ['M', 'L', 'XL', 'XXL'],
        badge: 'Limited',
        image: 'https://images.unsplash.com/photo-1618354691551-44de113f0164?w=400',
        inStock: true,
        description: 'Unique floral embroidery pattern - limited collection'
    },
    
    // Product 6
    {
        id: 6,
        name: 'Modern Navy Agbada',
        category: 'modern',
        price: 82000,
        originalPrice: null,
        sizes: ['S', 'M', 'L', 'XL'],
        badge: null,
        image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400',
        inStock: true,
        description: 'Rich navy blue fabric with subtle modern stitching'
    }
    
    // ============================================================
    // 📌 HOW TO ADD MORE PRODUCTS:
    // Copy this template below and fill in your details:
    // ============================================================
    // {
    //     id: 7,  // Make sure the ID is unique!
    //     name: 'Name of Your Agbada',
    //     category: 'classic',  // Options: 'classic', 'modern', 'embroidery'
    //     price: 95000,
    //     originalPrice: null,  // Or put a number like 110000 for discount
    //     sizes: ['S', 'M', 'L', 'XL'],
    //     badge: 'New',  // Or null
    //     image: 'https://your-image-url.jpg',
    //     inStock: true,
    //     description: 'Short description of the product'
    // },
];

// ============================================================
// STEP 2: FORM SUBMISSION SETUP (How you get customer orders)
// ============================================================

// 🔵 OPTION 1: Formspree (EASIEST - Free 50 submissions/month)
// Go to https://formspree.io, create a form, and paste your ID below
// Example: 'xyzabcde' (the part after /f/ in your form URL)
const FORMSPREE_ID = 'YOUR_FORMSPREE_ID';  // 👈 REPLACE THIS!

// 🔵 OPTION 2: Google Apps Script (COMPLETELY FREE)
// Deploy your script and paste the URL below
// Example: 'https://script.google.com/macros/s/ABC123.../exec'
const GOOGLE_SCRIPT_URL = '';  // 👈 REPLACE IF USING GOOGLE SHEETS

// ============================================================
// STEP 3: APPLICATION STATE (Data that changes)
// ============================================================

let cart = [];  // Items customer adds to cart
let currentFilter = 'all';  // Current product filter
let registeredUsers = JSON.parse(localStorage.getItem('dperlesluxe_users')) || [];
let currentUser = JSON.parse(localStorage.getItem('dperlesluxe_current_user')) || null;

// ============================================================
// STEP 4: DOM REFERENCES (Connecting to HTML elements)
// ============================================================

const productGrid = document.getElementById('productGrid');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const placeOrderBtn = document.getElementById('placeOrderBtn');
const navLinks = document.getElementById('navLinks');
const hamburger = document.getElementById('hamburger');

// ============================================================
// STEP 5: TOAST NOTIFICATION (Pop-up messages)
// ============================================================

function showToast(message, type = 'info') {
    // Remove any existing toast
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // Auto-remove after 3.5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 3500);
}

// ============================================================
// STEP 6: RENDER PRODUCTS (Display products on the page)
// ============================================================

function renderProducts(filter = 'all') {
    // Filter products based on category
    const filtered = filter === 'all'
        ? products
        : products.filter(p => p.category === filter);

    // Show message if no products
    if (filtered.length === 0) {
        productGrid.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:60px 0;color:var(--primary-light);">
                <i class="fas fa-box-open" style="font-size:3rem;display:block;margin-bottom:16px;"></i>
                <p>No products in this category yet.</p>
                <p style="font-size:0.9rem;">Check back soon for new arrivals!</p>
            </div>
        `;
        return;
    }

    // Generate HTML for each product
    productGrid.innerHTML = filtered.map(product => {
        // Create size buttons
        const sizesHTML = product.sizes.map(size =>
            `<button class="size-option" data-size="${size}">${size}</button>`
        ).join('');

        // Create badge if exists
        const badgeHTML = product.badge
            ? `<span class="badge">${product.badge}</span>`
            : '';

        // Original price (if discounted)
        const originalPriceHTML = product.originalPrice
            ? `<span>₦${product.originalPrice.toLocaleString()}</span>`
            : '';

        // Stock status
        const stockHTML = !product.inStock
            ? `<div style="color:#b33c3c;font-weight:600;margin-top:4px;">Out of Stock</div>`
            : '';

        return `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image" style="background-image:url('${product.image}');background-size:cover;background-position:center;background-color:var(--primary-light);">
                    ${badgeHTML}
                    ${!product.inStock ? '<span class="badge" style="background:#b33c3c;color:white;">Sold Out</span>' : ''}
                </div>
                <div class="product-body">
                    <h3>${product.name}</h3>
                    <div class="category">${product.category}</div>
                    <p style="font-size:0.85rem;color:var(--primary-light);margin:4px 0 8px;line-height:1.4;">${product.description}</p>
                    <div class="price">
                        ₦${product.price.toLocaleString()}
                        ${originalPriceHTML}
                    </div>
                    ${stockHTML}
                    <div class="size-select">
                        <label>Select Size:</label>
                        ${sizesHTML}
                    </div>
                    <button class="btn-primary btn-small add-to-cart" data-id="${product.id}" ${!product.inStock ? 'disabled' : ''}>
                        <i class="fas fa-cart-plus"></i> ${product.inStock ? 'Add to Order' : 'Unavailable'}
                    </button>
                </div>
            </div>
        `;
    }).join('');

    // ===== ATTACH EVENT LISTENERS =====
    
    // Size selection
    document.querySelectorAll('.size-option').forEach(btn => {
        btn.addEventListener('click', function() {
            const parent = this.closest('.size-select');
            parent.querySelectorAll('.size-option').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.disabled) return;
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
// STEP 7: CART FUNCTIONS
// ============================================================

function addToCart(product, size) {
    // Check if item already in cart
    const existing = cart.find(item => item.id === product.id && item.size === size);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            ...product,
            size: size,
            quantity: 1
        });
    }
    updateCart();
    showToast(`✅ ${product.name} (${size}) added to order!`, 'success');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function updateCart() {
    // If cart empty
    if (cart.length === 0) {
        cartItems.innerHTML = `<p class="empty-cart">Your cart is empty.</p>`;
        cartTotal.textContent = '₦0';
        cartCount.textContent = '0';
        return;
    }

    // Display cart items
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

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `₦${total.toLocaleString()}`;

    // Update cart count badge
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalQty;
}

// ============================================================
// STEP 8: SEND ORDER TO FORM SERVICE
// ============================================================

async function sendOrderToService(orderData) {
    // Try Formspree first
    if (FORMSPREE_ID && FORMSPREE_ID !== 'YOUR_FORMSPREE_ID') {
        try {
            const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });
            if (response.ok) {
                return { success: true, service: 'Formspree' };
            }
        } catch (e) {
            console.log('Formspree failed, trying Google Script...');
        }
    }

    // Try Google Apps Script
    if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL !== '') {
        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });
            return { success: true, service: 'Google Sheets' };
        } catch (e) {
            console.log('Google Script failed');
        }
    }

    // Fallback: Save locally
    return { success: false };
}

// ============================================================
// STEP 9: PLACE ORDER
// ============================================================

async function placeOrder() {
    // Check if cart has items
    if (cart.length === 0) {
        showToast('Your cart is empty!', 'error');
        return;
    }

    // Check if user is signed in
    if (!currentUser) {
        showToast('Please sign in or register first!', 'error');
        document.getElementById('signin').scrollIntoView({ behavior: 'smooth' });
        return;
    }

    // Build order details
    const orderItems = cart.map(item =>
        `${item.name} (${item.size}) × ${item.quantity} = ₦${(item.price * item.quantity).toLocaleString()}`
    ).join('\n');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Prepare data for submission
    const orderData = {
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone,
        location: currentUser.location || 'F01 Market, Abuja',
        items: orderItems,
        itemsArray: cart.map(item => ({
            name: item.name,
            size: item.size,
            quantity: item.quantity,
            price: item.price
        })),
        total: total,
        totalFormatted: `₦${total.toLocaleString()}`,
        status: 'Pending',
        orderDate: new Date().toISOString(),
        source: "D'perlesluxe Website"
    };

    // Show loading state
    placeOrderBtn.disabled = true;
    placeOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    try {
        // Send to your form service
        const result = await sendOrderToService(orderData);

        // Save order locally as backup
        const orders = JSON.parse(localStorage.getItem('dperlesluxe_orders')) || [];
        orders.push({
            ...orderData,
            id: Date.now(),
            localOnly: !result.success
        });
        localStorage.setItem('dperlesluxe_orders', JSON.stringify(orders));

        // Show success message
        const serviceMsg = result.success 
            ? `✅ Order sent via ${result.service}! We'll contact you shortly.` 
            : `✅ Order saved locally! Please contact us directly to confirm your order.\n\nContact: 081 3858 6051`;

        alert(
            `🛍️ ORDER PLACED SUCCESSFULLY!\n\n` +
            `━━━━━━━━━━━━━━━━━━━━━━\n` +
            `👤 Customer: ${currentUser.name}\n` +
            `📧 Email: ${currentUser.email}\n` +
            `📱 Phone: ${currentUser.phone}\n` +
            `📍 Location: ${currentUser.location || 'F01 Market, Abuja'}\n` +
            `━━━━━━━━━━━━━━━━━━━━━━\n` +
            `📦 Order Details:\n${orderItems}\n` +
            `━━━━━━━━━━━━━━━━━━━━━━\n` +
            `💰 Total: ₦${total.toLocaleString()}\n` +
            `━━━━━━━━━━━━━━━━━━━━━━\n` +
            `${serviceMsg}\n\n` +
            `📨 A confirmation has been sent to your email.`
        );

        // Clear cart
        cart = [];
        updateCart();
        showToast('🎉 Order placed successfully! Check your email.', 'success');

        // Scroll to home
        document.getElementById('home').scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error('Order error:', error);
        showToast('Error placing order. Please contact us directly.', 'error');
    } finally {
        placeOrderBtn.disabled = false;
        placeOrderBtn.innerHTML = '<i class="fas fa-check-circle"></i> Place Order';
    }
}

// ============================================================
// STEP 10: REGISTRATION
// ============================================================

function handleRegister(e) {
    e.preventDefault();

    // Get form values
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const password = document.getElementById('regPassword').value;
    const location = document.getElementById('regLocation').value.trim() || 'F01 Market, Abuja';

    // Validate
    if (!name || !email || !phone || password.length < 6) {
        showToast('Please fill all fields correctly (password min 6 chars)', 'error');
        return;
    }

    // Check if user already exists
    if (registeredUsers.find(u => u.email === email)) {
        showToast('User with this email already exists!', 'error');
        return;
    }

    // Save user
    const user = { name, email, phone, password, location };
    registeredUsers.push(user);
    localStorage.setItem('dperlesluxe_users', JSON.stringify(registeredUsers));

    // Auto-login
    currentUser = { name, email, phone, location };
    localStorage.setItem('dperlesluxe_current_user', JSON.stringify(currentUser));

    showToast(`Welcome, ${name}! Registration successful.`, 'success');
    document.getElementById('registerForm').reset();

    updateNavForUser();
    document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });

    // Send registration notification (optional)
    try {
        if (FORMSPREE_ID && FORMSPREE_ID !== 'YOUR_FORMSPREE_ID') {
            fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'New Registration',
                    name: name,
                    email: email,
                    phone: phone,
                    location: location,
                    date: new Date().toISOString()
                })
            });
        }
    } catch (e) { /* ignore */ }
}

// ============================================================
// STEP 11: SIGN IN
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
// STEP 12: UPDATE NAV (Show user name when signed in)
// ============================================================

function updateNavForUser() {
    const navLinksContainer = document.getElementById('navLinks');
    const existingUser = navLinksContainer.querySelector('.user-greeting');
    if (existingUser) existingUser.remove();

    if (currentUser) {
        const greeting = document.createElement('li');
        greeting.className = 'user-greeting';
        greeting.innerHTML = `<span style="color:var(--gold);font-weight:600;">👤 ${currentUser.name}</span>`;
        const signInLink = navLinksContainer.querySelector('a[href="#signin"]')?.closest('li');
        if (signInLink) {
            navLinksContainer.insertBefore(greeting, signInLink);
        } else {
            navLinksContainer.appendChild(greeting);
        }
    }
}

// ============================================================
// STEP 13: EVENT LISTENERS
// ============================================================

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentFilter = this.dataset.filter;
        renderProducts(currentFilter);
    });
});

// Place order button
placeOrderBtn.addEventListener('click', placeOrder);

// Hamburger menu (mobile)
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
    });
});

// Register form
document.getElementById('registerForm').addEventListener('submit', handleRegister);

// Sign in form
document.getElementById('signinForm').addEventListener('submit', handleSignIn);

// Smooth scroll for all anchor links
document.querySelectorAll('.nav-links a, .hero-buttons a').forEach(anchor => {
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
// STEP 14: INITIALIZE (Load everything when page loads)
// ============================================================

renderProducts('all');
updateCart();
updateNavForUser();

if (currentUser) {
    showToast(`Welcome back, ${currentUser.name}!`, 'info');
}

console.log('🚀 D\'perlesluxe Fashion Grid is ready!');
console.log(`📦 ${products.length} products loaded`);
console.log(`👥 ${registeredUsers.length} registered users`);
