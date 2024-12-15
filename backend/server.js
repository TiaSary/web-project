const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Database connection
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('Connected to SQLite database.');
});

// Initialize database tables
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      userType TEXT NOT NULL CHECK(userType IN ('buyer', 'seller'))
    )`
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sellerId INTEGER NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT,
      FOREIGN KEY (sellerId) REFERENCES users(id)
    )`
  );
  db.serialize(() => {
    db.run(
      `CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        productId INTEGER NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (productId) REFERENCES products(id)
      )`
    );
  
    db.run(
      `CREATE TABLE IF NOT EXISTS wishlist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        productId INTEGER NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (productId) REFERENCES products(id)
      )`
    );
    db.run(
        `CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId INTEGER NOT NULL,
          productId INTEGER NOT NULL,
          quantity INTEGER NOT NULL DEFAULT 1,
          status TEXT NOT NULL DEFAULT 'Pending',
          orderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users(id),
          FOREIGN KEY (productId) REFERENCES products(id)
        )`
    );
  });
  
});

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// User registration
app.post('/signup', (req, res) => {
  const { username, email, password, userType } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  const query = `INSERT INTO users (username, email, password, userType) VALUES (?, ?, ?, ?)`;
  db.run(query, [username, email, hashedPassword, userType], function (err) {
    if (err) return res.status(500).send({ error: err.message });
    res.status(201).send({ message: 'User registered successfully!' });
  });
});

// User login
app.post('/login', (req, res) => {
  const { username, email, password } = req.body;
  const query = `SELECT * FROM users WHERE username = ? OR email = ?`;

  db.get(query, [username, email], (err, user) => {
    if (err) return res.status(500).send({ error: err.message });
    if (!user) return res.status(401).send({ message: 'Invalid credentials!' });

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) return res.status(401).send({ message: 'Invalid credentials!' });

    const token = jwt.sign({ userId: user.id, userType: user.userType }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).send({ token, userType: user.userType });
  });
});

// Middleware for verifying JWT
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from "Bearer <token>"
    
    if (!token) {
      return res.status(401).send({ message: 'Unauthorized: Token missing!' });
    }
  
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: 'Unauthorized: Invalid token!' });
      }
      req.user = decoded; // Attach decoded token data to the request object
      next();
    });
  };

// Add product (Seller only)
app.post('/products', authenticate, (req, res) => {
  if (req.user.userType !== 'seller') return res.status(403).send({ message: 'Access denied!' });

  const { name, category, price, description } = req.body;
  const query = `INSERT INTO products (sellerId, name, category, price, description) VALUES (?, ?, ?, ?, ?)`;

  db.run(query, [req.user.userId, name, category, price, description], function (err) {
    if (err) return res.status(500).send({ error: err.message });
    res.status(201).send({ message: 'Product added successfully!' });
  });
});

// Get all products
app.get('/products', (req, res) => {
  const query = `SELECT * FROM products`;
  db.all(query, [], (err, products) => {
    if (err) return res.status(500).send({ error: err.message });
    res.status(200).send(products);
  });
});
// Get all users (Admin-only example, optional middleware for restricted access)
app.get('/users',authenticate, (req, res) => {
    // Optional: Check if the requester has admin privileges
    // if (req.user.userType !== 'admin') {
    //   return res.status(403).send({ message: 'Access denied!' });
    // }
  
    const query = `SELECT id, username, email, userType FROM users`;
    
    db.all(query, [], (err, users) => {
      if (err) return res.status(500).send({ error: err.message });
      res.status(200).send(users);
    });
  });
  
// Add product to cart (Buyer only)
app.post('/cart', authenticate, (req, res) => {
    if (req.user.userType !== 'buyer') return res.status(403).send({ message: 'Access denied!' });
  
    const { productId } = req.body;
  
    const query = `INSERT INTO cart (userId, productId) VALUES (?, ?)`;
    db.run(query, [req.user.userId, productId], function (err) {
      if (err) return res.status(500).send({ error: err.message });
      res.status(201).send({ message: 'Product added to cart successfully!' });
    });
  });
// Add product to wishlist (Buyer only)
app.post('/wishlist', authenticate, (req, res) => {
    if (req.user.userType !== 'buyer') return res.status(403).send({ message: 'Access denied!' });
  
    const { productId } = req.body;
  
    const query = `INSERT INTO wishlist (userId, productId) VALUES (?, ?)`;
    db.run(query, [req.user.userId, productId], function (err) {
      if (err) return res.status(500).send({ error: err.message });
      res.status(201).send({ message: 'Product added to wishlist successfully!' });
    });
  });
    // Get all products in cart (Buyer only)
app.get('/cart', authenticate, (req, res) => {
    if (req.user.userType !== 'buyer') return res.status(403).send({ message: 'Access denied!' });
  
    const query = `
      SELECT products.id, products.name, products.category, products.price, products.description
      FROM cart
      JOIN products ON cart.productId = products.id
      WHERE cart.userId = ?`;
  
    db.all(query, [req.user.userId], (err, products) => {
      if (err) return res.status(500).send({ error: err.message });
      res.status(200).send(products);
    });
  });
  // Get all products in wishlist (Buyer only)
app.get('/wishlist', authenticate, (req, res) => {
    if (req.user.userType !== 'buyer') return res.status(403).send({ message: 'Access denied!' });
  
    const query = `
      SELECT products.id, products.name, products.category, products.price, products.description
      FROM wishlist
      JOIN products ON wishlist.productId = products.id
      WHERE wishlist.userId = ?`;
  
    db.all(query, [req.user.userId], (err, products) => {
      if (err) return res.status(500).send({ error: err.message });
      res.status(200).send(products);
    });
  });
  // Create an order (Buyer only)
  app.post('/orders', authenticate, (req, res) => {
    if (req.user.userType !== 'buyer') return res.status(403).send({ message: 'Access denied!' });
  
    const { productId, quantity } = req.body;
  
    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).send({ message: 'Invalid product or quantity!' });
    }
  
    const createOrderQuery = `INSERT INTO orders (userId, productId, quantity, status) VALUES (?, ?, ?, ?)`;
    const deleteFromCartQuery = `DELETE FROM cart WHERE userId = ? AND productId = ?`;
  
    // Use a transaction-like pattern to handle the operations
    db.serialize(() => {
      // Step 1: Insert the order
      db.run(createOrderQuery, [req.user.userId, productId, quantity, 'Pending'], function (err) {
        if (err) {
          return res.status(500).send({ error: 'Failed to create order.' });
        }
  
        // Step 2: Remove the product from the cart
        db.run(deleteFromCartQuery, [req.user.userId, productId], function (err) {
          if (err) {
            return res.status(500).send({ error: 'Order created, but failed to remove item from cart.' });
          }
  
          // Step 3: Respond with success
          res.status(201).send({ message: 'Order created successfully and item removed from cart!', orderId: this.lastID });
        });
      });
    });
  });
  
  // Get all orders for the logged-in buyer
app.get('/orders', authenticate, (req, res) => {
    if (req.user.userType !== 'buyer') return res.status(403).send({ message: 'Access denied!' });
  
    const query = `
      SELECT orders.id AS orderId, products.name AS productName, orders.quantity, orders.status, orders.orderDate
      FROM orders
      JOIN products ON orders.productId = products.id
      WHERE orders.userId = ?
      ORDER BY orders.orderDate DESC`;
  
    db.all(query, [req.user.userId], (err, orders) => {
      if (err) return res.status(500).send({ error: err.message });
      res.status(200).send(orders);
    });
  });
  // Get all orders for the seller's products (Seller only)
app.get('/seller/orders', authenticate, (req, res) => {
    if (req.user.userType !== 'seller') return res.status(403).send({ message: 'Access denied!' });
  
    const query = `
      SELECT orders.id AS orderId, products.name AS productName, orders.quantity, orders.status, orders.orderDate
      FROM orders
      JOIN products ON orders.productId = products.id
      WHERE products.sellerId = ?
      ORDER BY orders.orderDate DESC`;
  
    db.all(query, [req.user.userId], (err, orders) => {
      if (err) return res.status(500).send({ error: err.message });
      res.status(200).send(orders);
    });
  });
  // Get products by category
app.get('/products/category/:category', (req, res) => {
    const { category } = req.params;
  
    const query = `SELECT * FROM products WHERE category = ?`;
    db.all(query, [category], (err, products) => {
      if (err) {
        return res.status(500).send({ error: 'Failed to fetch products by category.' });
      }
  
      if (products.length === 0) {
        return res.status(404).send({ message: 'No products found in this category.' });
      }
  
      res.status(200).send(products);
    });
  });
  
  
  
// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
