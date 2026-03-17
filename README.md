# ShopHub E-commerce Store - Database & Backend Setup

## 📦 Project Structure

```
new code/
├── index.html          (Home page)
├── products.html       (Product listing)
├── cart.html          (Shopping cart)
├── checkout.html      (Checkout form)
├── styles.css         (Styling)
├── script.js          (Frontend JavaScript)
├── server.js          (Express backend server)
├── package.json       (Dependencies)
├── products.json      (Products database)
├── orders.json        (Orders database)
├── users.json         (Users database)
└── README.md          (This file)
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

This will install:
- **express** - Web framework
- **cors** - Enable cross-origin requests
- **body-parser** - Parse request bodies
- **uuid** - Generate unique IDs
- **nodemon** (dev) - Auto-restart server on changes

### 2. Start the Server
```bash
npm start
```

Server will run on `http://localhost:3000`

### 3. Open the Website
- Open `index.html` in your browser
- The website will now connect to the backend database

---

## 📚 API Documentation

### Base URL: `http://localhost:3000/api`

### ========== PRODUCTS ==========

#### Get All Products
```
GET /api/products
```
Returns all products from the database.

**Example Response:**
```json
[
  {
    "id": 1,
    "name": "Wireless Headphones",
    "price": 79.99,
    "category": "Electronics",
    "stock": 50,
    "sku": "WH-001"
  }
]
```

#### Get Single Product
```
GET /api/products/:id
```
Returns a specific product by ID.

#### Add New Product
```
POST /api/products
Content-Type: application/json

{
  "name": "New Product",
  "price": 99.99,
  "category": "Electronics",
  "image": "🎧",
  "description": "Product description",
  "rating": 4.5,
  "stock": 50,
  "sku": "NEW-001"
}
```

#### Update Product
```
PUT /api/products/:id
Content-Type: application/json

{
  "price": 89.99,
  "stock": 45
}
```

#### Delete Product
```
DELETE /api/products/:id
```

---

### ========== ORDERS ==========

#### Get All Orders
```
GET /api/orders
```

#### Get Single Order
```
GET /api/orders/:id
```

#### Create New Order
```
POST /api/orders
Content-Type: application/json

{
  "customerId": "user-id",
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 79.99
    }
  ],
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipcode": "10001",
  "country": "USA",
  "total": 169.98
}
```

#### Update Order Status
```
PUT /api/orders/:id
Content-Type: application/json

{
  "status": "shipped"
}
```

---

### ========== USERS ==========

#### Get All Users
```
GET /api/users
```

#### Register New User
```
POST /api/users/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login User
```
POST /api/users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

---

### ========== STATISTICS ==========

#### Get Dashboard Stats
```
GET /api/stats
```

Returns total products, orders, users, and revenue.

**Example Response:**
```json
{
  "totalProducts": 12,
  "totalOrders": 5,
  "totalUsers": 3,
  "totalRevenue": 1250.50
}
```

#### Health Check
```
GET /api/health
```

---

## 📁 Database Files

### products.json
Contains all product information:
- Product ID, name, price, category
- Stock levels
- Ratings and descriptions

### orders.json
Stores all customer orders:
- Order ID, status
- Customer details
- Order items and totals
- Timestamps

### users.json
Manages user accounts:
- User ID, email, name
- Password (should be hashed in production)
- Registration timestamp

---

## 🛠️ Testing the API

### Using cURL
```bash
# Get all products
curl http://localhost:3000/api/products

# Get specific product
curl http://localhost:3000/api/products/1

# Create new order
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"customerId":"123","total":199.99}'
```

### Using Postman
1. Import the API endpoints
2. Create requests for each endpoint
3. Test different HTTP methods (GET, POST, PUT, DELETE)

### Using Browser DevTools
Open DevTools Console and use fetch:
```javascript
// Get all products
fetch('http://localhost:3000/api/products')
  .then(res => res.json())
  .then(data => console.log(data));

// Create an order
fetch('http://localhost:3000/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    customerId: '123',
    total: 199.99
  })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## 🔐 Security Notes

⚠️ **For Production:**
- Hash passwords using bcrypt
- Add authentication tokens (JWT)
- Implement rate limiting
- Use HTTPS
- Add input validation
- Use a proper database (MongoDB, PostgreSQL)
- Never commit sensitive data

---

## 📝 Common Tasks

### Add a New Product to Database
1. Use POST `/api/products` endpoint
2. Or manually edit `products.json`
3. Include: name, price, category, description, stock, etc.

### View All Orders
```bash
curl http://localhost:3000/api/orders
```

### Get Store Statistics
```bash
curl http://localhost:3000/api/stats
```

---

## ❓ Troubleshooting

**Server won't start:**
- Make sure port 3000 is not in use
- Check Node.js is installed: `node --version`
- Run `npm install` again

**API not responding:**
- Check server is running on http://localhost:3000
- Check CORS is enabled
- Verify JSON files exist

**Modules not found:**
- Delete `node_modules` folder
- Run `npm install` again

---

## 📞 Support

For issues or questions:
1. Check that server is running
2. Verify database files exist
3. Check browser console for errors
4. Check server console for error messages

---

**ShopHub Database Setup Complete!** 🎉
