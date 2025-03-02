import express from 'express';
import { nanoid } from 'nanoid';
import { JSONFilePreset } from 'lowdb/node';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express();
app.use(express.json());

// Secret key for JWT
const SECRET_KEY = 'your_secret_key'; // Change this to a secure, environment-stored key

// Set up lowdb to use a JSON file for storage
const db = await JSONFilePreset('db.json', {});

// Initialize the database with a default structure if empty
async function initDB() {
  await db.read();
  db.data = db.data || { shoes: [], users: [] };
  await db.write();
}
initDB();

// Middleware to verify JWT
function authenticateToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token.' });
  }
}

// User Registration
app.post('/register', async (req, res) => {
  await db.read();
  const { username, password } = req.body;
  const existingUser = db.data.users.find(u => u.username === username);

  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: nanoid(),
    username,
    password: hashedPassword,
  };

  db.data.users.push(newUser);
  await db.write();
  res.status(201).json({ message: 'User registered successfully' });
});

// User Login
app.post('/login', async (req, res) => {
  await db.read();
  const { username, password } = req.body;
  const user = db.data.users.find(u => u.username === username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

// Public route (no auth required)
app.get('/', async (req, res) => {
  res.json(`Welcome to "The Shoes Shop" API.`);
});

// GET /shoes - Retrieve all shoes (No authentication required)
app.get('/shoes', async (req, res) => {
  await db.read();
  res.json(db.data.shoes);
});

// GET /shoes/:id - Retrieve a single shoe by ID
app.get('/shoes/:id', async (req, res) => {
  await db.read();
  const shoe = db.data.shoes.find(s => s.id == req.params.id);
  if (!shoe) {
    return res.status(404).json({ error: 'Shoe not found' });
  }
  res.json(shoe);
});

// POST /shoes - Create a new shoe (Requires authentication)
app.post('/shoes', authenticateToken, async (req, res) => {
  await db.read();
  const { brand, model, size, color, price } = req.body;
  const newShoe = {
    id: nanoid(),
    brand,
    model,
    size,
    color,
    price
  };
  db.data.shoes.push(newShoe);
  await db.write();
  res.status(201).json(newShoe);
});

// PUT /shoes/:id - Update an existing shoe (Requires authentication)
app.put('/shoes/:id', authenticateToken, async (req, res) => {
  await db.read();
  const shoe = db.data.shoes.find(s => s.id == req.params.id);
  if (!shoe) {
    return res.status(404).json({ error: 'Shoe not found' });
  }
  const { brand, model, size, color, price } = req.body;
  shoe.brand = brand !== undefined ? brand : shoe.brand;
  shoe.model = model !== undefined ? model : shoe.model;
  shoe.size = size !== undefined ? size : shoe.size;
  shoe.color = color !== undefined ? color : shoe.color;
  shoe.price = price !== undefined ? price : shoe.price;
  await db.write();
  res.json(shoe);
});

// DELETE /shoes/:id - Delete a shoe (Requires authentication)
app.delete('/shoes/:id', authenticateToken, async (req, res) => {
  await db.read();
  const index = db.data.shoes.findIndex(s => s.id == req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Shoe not found' });
  }
  db.data.shoes.splice(index, 1);
  await db.write();
  res.status(204).end();
});

// GET /shoes/search - Search shoes by query parameters
app.get('/search-shoes', async (req, res) => {
  await db.read();
  
  const { brand, model, size, color, price } = req.query;

  let results = db.data.shoes;

  if (brand) results = results.filter(s => s.brand.toLowerCase().includes(brand.toLowerCase()));
  if (model) results = results.filter(s => s.model.toLowerCase().includes(model.toLowerCase()));
  if (size) results = results.filter(s => s.size == size);
  if (color) results = results.filter(s => s.color.toLowerCase().includes(color.toLowerCase()));
  if (price) results = results.filter(s => s.price == price);

  res.json(results);
});

// Start the server
const port = process.env.PORT || 3000;


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

