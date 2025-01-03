const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
}));

// ✅ Test Route for Root
app.get('/', (req, res) => {
    res.status(200).send('✅ Backend is running successfully!');
});

// ✅ Authentication Routes
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

// ✅ Inventory Routes
const inventoryRoutes = require('./routes/inventoryRoutes');
app.use('/inventory', inventoryRoutes);

module.exports = app;
