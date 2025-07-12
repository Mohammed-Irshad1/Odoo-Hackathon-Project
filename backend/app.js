const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);
const itemRoutes = require('./routes/items');
app.use('/api/items', itemRoutes);

app.get('/', (req, res) => {
  res.send('ReWear API is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
