// 📦 Import Required Modules
const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const {
    fetchInventory,
    addInventory,
    reduceStock,
    searchInventory
} = require('../controllers/inventoryController');

// 🚀 Create Router Instance
const router = express.Router();

/*
|--------------------------------------------------------------------------
| 🛡️ Middleware: Authentication
|--------------------------------------------------------------------------
| All routes are protected using `authMiddleware`.
| Ensure the client has a valid token to access these endpoints.
*/

// ✅ Fetch All Inventory Items
router.get('/', authMiddleware, fetchInventory);

/*
|--------------------------------------------------------------------------
| ➕ Add New Inventory Item
|--------------------------------------------------------------------------
| Route: POST /inventory
| Description: Adds a new inventory item with details like name, stock, price, etc.
*/
router.post('/', authMiddleware, addInventory);

/*
|--------------------------------------------------------------------------
| 📉 Reduce Stock of an Inventory Item
|--------------------------------------------------------------------------
| Route: PUT /inventory/reduce-stock/:id
| Description: Reduces the stock of a specific inventory item by a given quantity.
| Body: { quantity: number, rev: string }
*/
router.put('/reduce-stock/:id', authMiddleware, reduceStock);

/*
|--------------------------------------------------------------------------
| 🔍 Search Inventory
|--------------------------------------------------------------------------
| Route: GET /inventory/search
| Description: Searches inventory based on name, stock room, or other criteria.
*/
router.get('/search', authMiddleware, searchInventory);

// 📤 Export Router
module.exports = router;
