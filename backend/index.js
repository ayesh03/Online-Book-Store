const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Book = require('./models/Book');
const User = require('./models/User');
const Order = require('./models/Order');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/bookstore', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const JWT_SECRET = 'your-secret-key';

const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.userId = decoded.userId;
    next();
  });
};

// Register User
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, cart: [], orders: [], wishlist: [] });
    await user.save();
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(400).json({ error: err.message || 'Registration failed' });
  }
});

// Login User
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, userId: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Login failed' });
  }
});

// Get All Books (No Pagination)
app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch books' });
  }
});

// Get Book by ID
app.get('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch book' });
  }
});

// Add Book
app.post('/api/books', async (req, res) => {
  try {
    const book = new Book(req.body);
    const savedBook = await book.save();
    res.status(201).json(savedBook);
  } catch (err) {
    res.status(400).json({ error: err.message || 'Failed to add book' });
  }
});

// Delete Book
app.delete('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to delete book' });
  }
});

// Add to Cart
app.post('/api/cart', authenticate, async (req, res) => {
  const { bookId } = req.body;
  try {
    const user = await User.findById(req.userId);
    if (!user.cart.includes(bookId)) {
      user.cart.push(bookId);
      await user.save();
    }
    res.json({ cart: user.cart });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to add to cart' });
  }
});

// Get Cart
app.get('/api/cart', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('cart');
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch cart' });
  }
});

// Remove from Cart
app.delete('/api/cart/:bookId', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.cart = user.cart.filter(id => id.toString() !== req.params.bookId);
    await user.save();
    res.json({ cart: user.cart });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to remove from cart' });
  }
});

// Checkout
app.post('/api/checkout', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('cart');
    if (!user.cart.length) return res.status(400).json({ error: 'Cart is empty' });

    const totalPrice = user.cart.reduce((sum, book) => sum + book.price, 0);
    const order = new Order({
      userId: req.userId,
      books: user.cart,
      totalPrice
    });
    await order.save();

    user.orders.push(order._id);
    user.cart = [];
    await user.save();

    res.json({ message: 'Checkout successful', order });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: err.message || 'Checkout failed' });
  }
});

// Get Orders
app.get('/api/orders', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate({
      path: 'orders',
      populate: { path: 'books' }
    });
    res.json(user.orders);
  } catch (err) {
    console.error('Orders error:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch orders' });
  }
});

// Get User Info
app.get('/api/user', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('email');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ email: user.email });
  } catch (err) {
    console.error('User fetch error:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch user' });
  }
});

// Add to Wishlist
app.post('/api/wishlist', authenticate, async (req, res) => {
  const { bookId } = req.body;
  try {
    const user = await User.findById(req.userId);
    if (!user.wishlist.includes(bookId)) {
      user.wishlist.push(bookId);
      await user.save();
    }
    res.json({ wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to add to wishlist' });
  }
});

// Get Wishlist
app.get('/api/wishlist', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('wishlist');
    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch wishlist' });
  }
});

// Remove from Wishlist
app.delete('/api/wishlist/:bookId', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.bookId);
    await user.save();
    res.json({ wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to remove from wishlist' });
  }
});

// Add Review
app.post('/api/books/:id/reviews', authenticate, async (req, res) => {
  const { rating, comment } = req.body;
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    book.reviews.push({ userId: req.userId, rating, comment });
    await book.save();
    res.status(201).json(book.reviews);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to add review' });
  }
});

// Get Reviews
app.get('/api/books/:id/reviews', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('reviews.userId', 'email');
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book.reviews);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch reviews' });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));