// Product Database
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 79.99,
        category: "Electronics",
        image: "🎧",
        description: "High-quality wireless headphones with noise cancellation",
        rating: 4.5
    },
    {
        id: 2,
        name: "USB-C Cable",
        price: 12.99,
        category: "Electronics",
        image: "🔌",
        description: "Durable and fast-charging USB-C cable",
        rating: 4.3
    },
    {
        id: 3,
        name: "T-Shirt",
        price: 24.99,
        category: "Clothing",
        image: "👕",
        description: "Comfortable cotton t-shirt available in multiple colors",
        rating: 4.2
    },
    {
        id: 4,
        name: "Jeans",
        price: 49.99,
        category: "Clothing",
        image: "👖",
        description: "Classic blue denim jeans perfect for everyday wear",
        rating: 4.4
    },
    {
        id: 5,
        name: "Programming Book",
        price: 39.99,
        category: "Books",
        image: "📖",
        description: "Complete guide to modern web development",
        rating: 4.6
    },
    {
        id: 6,
        name: "JavaScript Guide",
        price: 34.99,
        category: "Books",
        image: "📚",
        description: "Learn JavaScript from beginner to advanced",
        rating: 4.5
    },
    {
        id: 7,
        name: "Coffee Maker",
        price: 89.99,
        category: "Home",
        image: "☕",
        description: "Programmable coffee maker with thermal carafe",
        rating: 4.3
    },
    {
        id: 8,
        name: "Desk Lamp",
        price: 45.99,
        category: "Home",
        image: "💡",
        description: "LED desk lamp with adjustable brightness",
        rating: 4.4
    },
    {
        id: 9,
        name: "Smartphone",
        price: 599.99,
        category: "Electronics",
        image: "📱",
        description: "Latest smartphone with advanced features",
        rating: 4.7
    },
    {
        id: 10,
        name: "Sneakers",
        price: 89.99,
        category: "Clothing",
        image: "👟",
        description: "Comfortable and stylish sports sneakers",
        rating: 4.5
    },
    {
        id: 11,
        name: "Design Book",
        price: 44.99,
        category: "Books",
        image: "🎨",
        description: "Essential principles of UI/UX design",
        rating: 4.4
    },
    {
        id: 12,
        name: "Pillow",
        price: 29.99,
        category: "Home",
        image: "🛏️",
        description: "Premium memory foam pillow for better sleep",
        rating: 4.3
    }
];

// Cart Management
let cart = [];
let currentProduct = null;

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    // Load cart from localStorage on page load
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        try {
            const parsedCart = JSON.parse(savedCart);
            if (Array.isArray(parsedCart) && parsedCart.length > 0) {
                cart = parsedCart;
            }
        } catch (e) {
            cart = [];
        }
    }
    
    updateCartCount();
    const path = window.location.pathname;
    
    if (path.includes('index.html') || path.endsWith('/')) {
        loadFeaturedProducts();
    } else if (path.includes('products.html')) {
        loadAllProducts();
        setupFilters();
    } else if (path.includes('cart.html')) {
        loadCart();
    } else if (path.includes('checkout.html')) {
        loadCheckout();
    }
});

// Featured Products on Home Page
function loadFeaturedProducts() {
    const featured = products.slice(0, 6);
    const container = document.getElementById('featuredProducts');
    if (!container) return;
    
    container.innerHTML = featured.map(product => createProductCard(product)).join('');
    attachProductCardListeners();
}

// Load All Products
function loadAllProducts(filtered = false) {
    const container = document.getElementById('productsGrid');
    if (!container) return;
    
    let productsToShow = filtered ? getFilteredProducts() : products;
    
    if (productsToShow.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">No products found</p>';
    } else {
        container.innerHTML = productsToShow.map(product => createProductCard(product)).join('');
    }
    
    attachProductCardListeners();
}

// Create Product Card HTML
function createProductCard(product) {
    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">${product.image}</div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <span class="product-category">${product.category}</span>
                <div class="product-rating">${'★'.repeat(Math.floor(product.rating))} ${product.rating}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="btn-add-to-cart" data-product-id="${product.id}">Add to Cart</button>
            </div>
        </div>
    `;
}

// Attach Listeners to Product Cards
function attachProductCardListeners() {
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('btn-add-to-cart')) {
                const productId = parseInt(this.dataset.productId);
                openProductModal(productId);
            }
        });
    });
    
    document.querySelectorAll('.btn-add-to-cart').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const productId = parseInt(this.dataset.productId);
            addToCart(productId, 1);
        });
    });
}

// Open Product Modal
function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    currentProduct = product;
    const modal = document.getElementById('productModal');
    
    document.getElementById('modalImage').innerHTML = `<div style="font-size: 80px;">${product.image}</div>`;
    document.getElementById('modalTitle').textContent = product.name;
    document.getElementById('modalCategory').textContent = product.category;
    document.getElementById('modalDescription').textContent = product.description;
    document.getElementById('modalPrice').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('quantityInput').value = 1;
    
    modal.style.display = 'block';
}

// Modal Controls
const modal = document.getElementById('productModal');
const closeBtn = document.querySelector('.close');

if (closeBtn) {
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
}

if (modal) {
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Quantity Controls
const quantityInput = document.getElementById('quantityInput');
const increaseBtn = document.getElementById('increaseQty');
const decreaseBtn = document.getElementById('decreaseQty');

if (increaseBtn) increaseBtn.addEventListener('click', () => {
    quantityInput.value = Math.min(parseInt(quantityInput.value) + 1, 999);
});

if (decreaseBtn) decreaseBtn.addEventListener('click', () => {
    quantityInput.value = Math.max(parseInt(quantityInput.value) - 1, 1);
});

// Add to Cart from Modal
const addToCartBtn = document.getElementById('addToCartBtn');
if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function() {
        if (currentProduct) {
            const quantity = parseInt(document.getElementById('quantityInput').value);
            addToCart(currentProduct.id, quantity);
            modal.style.display = 'none';
            showNotification('Product added to cart!');
        }
    });
}

// Add to Cart Function
function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: product.image,
            category: product.category
        });
    }
    
    saveCart();
    updateCartCount();
    showNotification(`${product.name} added to cart!`);
}

// Save Cart to LocalStorage
function saveCart() {
    if (cart && Array.isArray(cart)) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
}

// Update Cart Count in Navbar
function updateCartCount() {
    const cartCounts = document.querySelectorAll('#cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCounts.forEach(count => {
        count.textContent = totalItems;
    });
}

// Load Cart Page
function loadCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '';
        emptyCart.style.display = 'block';
    } else {
        emptyCart.style.display = 'none';
        cartItemsContainer.innerHTML = cart.map(item => `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 30px;">${item.image}</span>
                        <div>
                            <div style="font-weight: 600;">${item.name}</div>
                            <div style="font-size: 12px; color: #999;">${item.category}</div>
                        </div>
                    </div>
                </td>
                <td>$${item.price.toFixed(2)}</td>
                <td>
                    <div class="cart-quantity">
                        <button class="btn-quantity" data-product-id="${item.id}" data-action="decrease">-</button>
                        <input type="number" value="${item.quantity}" min="1" data-product-id="${item.id}" class="quantity-input">
                        <button class="btn-quantity" data-product-id="${item.id}" data-action="increase">+</button>
                    </div>
                </td>
                <td>$${(item.price * item.quantity).toFixed(2)}</td>
                <td>
                    <button class="btn-remove" data-product-id="${item.id}">Remove</button>
                </td>
            </tr>
        `).join('');
        
        // Attach Event Listeners
        document.querySelectorAll('.btn-quantity').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.dataset.productId);
                const action = this.dataset.action;
                updateQuantity(productId, action);
            });
        });
        
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', function() {
                const productId = parseInt(this.dataset.productId);
                const newQuantity = parseInt(this.value);
                updateQuantityDirect(productId, newQuantity);
            });
        });
        
        document.querySelectorAll('.btn-remove').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.dataset.productId);
                removeFromCart(productId);
            });
        });
    }
    
    updateCartSummary();
}

// Update Quantity
function updateQuantity(productId, action) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    if (action === 'increase') {
        item.quantity++;
    } else if (action === 'decrease') {
        item.quantity = Math.max(1, item.quantity - 1);
    }
    
    saveCart();
    updateCartCount();
    loadCart();
}

// Update Quantity Directly
function updateQuantityDirect(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity = Math.max(1, newQuantity);
    saveCart();
    updateCartCount();
    loadCart();
}

// Remove from Cart
function removeFromCart(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        const itemName = cart[itemIndex].name;
        cart.splice(itemIndex, 1);
        saveCart();
        updateCartCount();
        loadCart();
        showNotification(`${itemName} removed from cart`);
    }
}

// Update Cart Summary
function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const shipping = cart.length > 0 ? 10 : 0;
    const total = subtotal + tax + shipping;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

// Checkout Button
const checkoutBtn = document.getElementById('checkoutBtn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            showNotification('Your cart is empty!');
        } else {
            window.location.href = 'checkout.html';
        }
    });
}

// Load Checkout Page
function loadCheckout() {
    if (cart.length === 0) {
        window.location.href = 'products.html';
        return;
    }
    
    loadOrderReview();
    setupCheckoutForm();
}

// Load Order Review
function loadOrderReview() {
    const orderItems = document.getElementById('orderItems');
    if (!orderItems) return;
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const shipping = 10;
    const total = subtotal + tax + shipping;
    
    orderItems.innerHTML = cart.map(item => `
        <div class="order-item">
            <span>${item.name} x ${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
    
    document.getElementById('reviewSubtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('reviewTax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('reviewShipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('reviewTotal').textContent = `$${total.toFixed(2)}`;
}

// Setup Checkout Form
function setupCheckoutForm() {
    const checkoutForm = document.getElementById('checkoutForm');
    const sameAddressCheckbox = document.getElementById('sameAddress');
    
    if (!checkoutForm) return;
    
    // Format Card Number
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function() {
            this.value = this.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
        });
    }
    
    // Format Expiry
    const expiryInput = document.getElementById('expiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            this.value = value;
        });
    }
    
    // Format CVV
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').slice(0, 3);
        });
    }
    
    // Handle Payment Method Selection
    const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            toggleCardFields(this.value === 'card');
        });
    });
    
    // Initially toggle based on default
    toggleCardFields(document.querySelector('input[name="paymentMethod"]:checked').value === 'card');
    
    // Handle Form Submission
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateCheckoutForm()) {
            processOrder();
        }
    });
}

// Toggle Card Fields Visibility
function toggleCardFields(show) {
    const cardFields = document.getElementById('cardFields');
    const required = show;
    cardFields.style.display = show ? 'block' : 'none';
    document.getElementById('cardName').required = required;
    document.getElementById('cardNumber').required = required;
    document.getElementById('expiry').required = required;
    document.getElementById('cvv').required = required;
}

// Validate Checkout Form
function validateCheckoutForm() {
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    if (paymentMethod === 'card') {
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
        const expiry = document.getElementById('expiry').value;
        const cvv = document.getElementById('cvv').value;
        
        if (cardNumber.length !== 16) {
            showNotification('Please enter a valid card number', 'error');
            return false;
        }
        
        if (!/^\d{2}\/\d{2}$/.test(expiry)) {
            showNotification('Please enter expiry in MM/YY format', 'error');
            return false;
        }
        
        if (cvv.length !== 3) {
            showNotification('Please enter a valid CVV', 'error');
            return false;
        }
    }
    
    return true;
}

// Process Order
function processOrder() {
    const orderNumber = Math.floor(Math.random() * 1000000);
    document.getElementById('orderNumber').textContent = `Order #: ${orderNumber}`;
    
    const successModal = document.getElementById('successModal');
    if (successModal) {
        successModal.style.display = 'block';
    }
    
    // Clear cart
    setTimeout(() => {
        cart = [];
        saveCart();
        updateCartCount();
        
        // Redirect after 3 seconds
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    }, 2000);
}

// Filter Products
function setupFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const priceValue = document.getElementById('priceValue');
    const resetBtn = document.getElementById('resetFilters');
    
    if (!categoryFilter || !priceFilter) return;
    
    categoryFilter.addEventListener('change', () => loadAllProducts(true));
    priceFilter.addEventListener('input', function() {
        priceValue.textContent = `$${this.value}`;
        loadAllProducts(true);
    });
    resetBtn.addEventListener('click', () => {
        categoryFilter.value = '';
        priceFilter.value = 5000;
        priceValue.textContent = '$5000';
        loadAllProducts(false);
    });
}

// Get Filtered Products
function getFilteredProducts() {
    const category = document.getElementById('categoryFilter')?.value || '';
    const maxPrice = parseInt(document.getElementById('priceFilter')?.value || 5000);
    
    return products.filter(product => {
        const categoryMatch = category === '' || product.category === category;
        const priceMatch = product.price <= maxPrice;
        return categoryMatch && priceMatch;
    });
}

// Show Notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background-color: ${type === 'error' ? '#dc3545' : '#28a745'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}