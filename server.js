const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Database file paths
const productsFile = path.join(__dirname, 'products.json');
const ordersFile = path.join(__dirname, 'orders.json');
const usersFile = path.join(__dirname, 'users.json');

// Helper functions to read/write JSON files
function readJSON(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        return null;
    }
}

function writeJSON(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error(`Error writing ${filePath}:`, error);
        return false;
    }
}

// ========== PRODUCTS ROUTES ==========

// Get all products
app.get('/api/products', (req, res) => {
    const data = readJSON(productsFile);
    if (data) {
        res.json(data.products);
    } else {
        res.status(500).json({ error: 'Failed to load products' });
    }
});

// Get single product by ID
app.get('/api/products/:id', (req, res) => {
    const data = readJSON(productsFile);
    if (data) {
        const product = data.products.find(p => p.id === parseInt(req.params.id));
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } else {
        res.status(500).json({ error: 'Failed to load products' });
    }
});

// Add new product (Admin only)
app.post('/api/products', (req, res) => {
    const data = readJSON(productsFile);
    if (!data) {
        return res.status(500).json({ error: 'Failed to read products' });
    }

    const newProduct = {
        id: Math.max(...data.products.map(p => p.id), 0) + 1,
        ...req.body,
        sku: req.body.sku || `SKU-${Date.now()}`
    };

    data.products.push(newProduct);
    if (writeJSON(productsFile, data)) {
        res.status(201).json(newProduct);
    } else {
        res.status(500).json({ error: 'Failed to add product' });
    }
});

// Update product
app.put('/api/products/:id', (req, res) => {
    const data = readJSON(productsFile);
    if (!data) {
        return res.status(500).json({ error: 'Failed to read products' });
    }

    const productIndex = data.products.findIndex(p => p.id === parseInt(req.params.id));
    if (productIndex !== -1) {
        data.products[productIndex] = { ...data.products[productIndex], ...req.body };
        if (writeJSON(productsFile, data)) {
            res.json(data.products[productIndex]);
        } else {
            res.status(500).json({ error: 'Failed to update product' });
        }
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
    const data = readJSON(productsFile);
    if (!data) {
        return res.status(500).json({ error: 'Failed to read products' });
    }

    const productIndex = data.products.findIndex(p => p.id === parseInt(req.params.id));
    if (productIndex !== -1) {
        const deletedProduct = data.products.splice(productIndex, 1);
        if (writeJSON(productsFile, data)) {
            res.json(deletedProduct[0]);
        } else {
            res.status(500).json({ error: 'Failed to delete product' });
        }
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

// ========== ORDERS ROUTES ==========

// Get all orders
app.get('/api/orders', (req, res) => {
    const data = readJSON(ordersFile);
    if (data) {
        res.json(data.orders);
    } else {
        res.status(500).json({ error: 'Failed to load orders' });
    }
});

// Get single order by ID
app.get('/api/orders/:id', (req, res) => {
    const data = readJSON(ordersFile);
    if (data) {
        const order = data.orders.find(o => o.id === req.params.id);
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ error: 'Order not found' });
        }
    } else {
        res.status(500).json({ error: 'Failed to load orders' });
    }
});

// Create new order
app.post('/api/orders', (req, res) => {
    const data = readJSON(ordersFile);
    if (!data) {
        return res.status(500).json({ error: 'Failed to read orders' });
    }

    const newOrder = {
        id: uuidv4(),
        ...req.body,
        createdAt: new Date().toISOString(),
        status: 'pending'
    };

    data.orders.push(newOrder);
    if (writeJSON(ordersFile, data)) {
        res.status(201).json(newOrder);
    } else {
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Update order status
app.put('/api/orders/:id', (req, res) => {
    const data = readJSON(ordersFile);
    if (!data) {
        return res.status(500).json({ error: 'Failed to read orders' });
    }

    const orderIndex = data.orders.findIndex(o => o.id === req.params.id);
    if (orderIndex !== -1) {
        data.orders[orderIndex] = { ...data.orders[orderIndex], ...req.body };
        if (writeJSON(ordersFile, data)) {
            res.json(data.orders[orderIndex]);
        } else {
            res.status(500).json({ error: 'Failed to update order' });
        }
    } else {
        res.status(404).json({ error: 'Order not found' });
    }
});

// ========== USERS ROUTES ==========

// Get all users
app.get('/api/users', (req, res) => {
    const data = readJSON(usersFile);
    if (data) {
        // Don't expose passwords
        const users = data.users.map(({ password, ...user }) => user);
        res.json(users);
    } else {
        res.status(500).json({ error: 'Failed to load users' });
    }
});

// Register new user
app.post('/api/users/register', (req, res) => {
    const data = readJSON(usersFile);
    if (!data) {
        return res.status(500).json({ error: 'Failed to read users' });
    }

    const { email, password, firstName, lastName } = req.body;

    // Check if user already exists
    if (data.users.find(u => u.email === email)) {
        return res.status(400).json({ error: 'User already exists' });
    }

    const newUser = {
        id: uuidv4(),
        email,
        password, // In production, this should be hashed
        firstName,
        lastName,
        createdAt: new Date().toISOString()
    };

    data.users.push(newUser);
    if (writeJSON(usersFile, data)) {
        const { password, ...userWithoutPassword } = newUser;
        res.status(201).json(userWithoutPassword);
    } else {
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Login user
app.post('/api/users/login', (req, res) => {
    const data = readJSON(usersFile);
    if (!data) {
        return res.status(500).json({ error: 'Failed to read users' });
    }

    const { email, password } = req.body;
    const user = data.users.find(u => u.email === email && u.password === password);

    if (user) {
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } else {
        res.status(401).json({ error: 'Invalid email or password' });
    }
});

// ========== STATISTICS ROUTES ==========

// Get dashboard statistics
app.get('/api/stats', (req, res) => {
    const productsData = readJSON(productsFile);
    const ordersData = readJSON(ordersFile);
    const usersData = readJSON(usersFile);

    const stats = {
        totalProducts: productsData?.products?.length || 0,
        totalOrders: ordersData?.orders?.length || 0,
        totalUsers: usersData?.users?.length || 0,
        totalRevenue: ordersData?.orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0
    };

    res.json(stats);
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ ShopHub Server is running on http://localhost:${PORT}`);
    console.log(`📦 Products: http://localhost:${PORT}/api/products`);
    console.log(`📋 Orders: http://localhost:${PORT}/api/orders`);
    console.log(`👥 Users: http://localhost:${PORT}/api/users`);
    console.log(`📊 Stats: http://localhost:${PORT}/api/stats`);
});