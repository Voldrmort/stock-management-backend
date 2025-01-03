const { cloudant, dbName, getDB } = require('../services/cloudantServices');


/**
 * Fetch Inventory
 * GET /inventory
 */
exports.fetchInventory = async (req, res) => {
    try {
        const result = await cloudant.postAllDocs({
            db: dbName,
            includeDocs: true,
        });

        const inventory = result.result.rows.map((row) => ({
            _id: row.doc._id,
            _rev: row.doc._rev,
            name: row.doc.name,
            stock: row.doc.stock,
            price: row.doc.price,
            stockRoom: row.doc.stockRoom,
        }));

        res.status(200).json(inventory);
    } catch (error) {
        console.error('Error fetching inventory:', error);
        res.status(500).json({ error: 'Failed to fetch inventory' });
    }
};

/**
 * Add or Update Inventory Item
 * POST /inventory
 */
exports.addInventory = async (req, res) => {
    const { name, stock, price, stockRoom } = req.body;

    if (!name || !stock || !price || !stockRoom) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Check if an item with the same name, price, and stockRoom exists
        const existingItems = await cloudant.postFind({
            db: dbName,
            selector: {
                name,
                price,
                stockRoom,
            },
        });

        if (existingItems.result.docs.length > 0) {
            const existingItem = existingItems.result.docs[0];
            const updatedStock = existingItem.stock + parseInt(stock);

            await cloudant.postDocument({
                db: dbName,
                document: {
                    ...existingItem,
                    stock: updatedStock,
                    _rev: existingItem._rev,
                },
            });

            return res.status(200).json({ message: 'Stock updated successfully' });
        }

        // Create a new inventory item if no match is found
        await cloudant.postDocument({
            db: dbName,
            document: {
                name,
                stock: parseInt(stock),
                price: parseFloat(price),
                stockRoom,
            },
        });

        res.status(201).json({ message: 'Item added successfully' });
    } catch (error) {
        console.error('Error adding inventory:', error);
        res.status(500).json({ error: 'Failed to add inventory' });
    }
};

/**
 * Reduce Stock
 * PUT /inventory/reduce-stock/:id
 */

exports.reduceStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity, rev } = req.body;

        console.log('🛠️ Reducing stock:', { id, quantity, rev });

        // Validation Logic
        if (!quantity || quantity <= 0) {
            return res.status(400).json({ message: 'Invalid stock reduction value.' });
        }

        if (!rev) {
            return res.status(400).json({ message: 'Revision ID (rev) is required.' });
        }

        // Fetch the document from Cloudant
        const itemResult = await cloudant.getDocument({
            db: dbName,
            docId: id,
        });

        const item = itemResult.result;

        if (!item || item._rev !== rev) {
            return res.status(400).json({ message: 'Item not found or revision mismatch.' });
        }

        // Reduce stock
        if (item.stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock.' });
        }

        item.stock -= quantity;

        // Update the document in Cloudant
        await cloudant.postDocument({
            db: dbName,
            document: {
                ...item,
                _rev: item._rev,
            },
        });

        res.status(200).json({ message: 'Stock reduced successfully', item });
    } catch (error) {
        console.error('❌ Backend Error:', error.message);
        res.status(500).json({ message: 'Failed to reduce stock', error: error.message });
    }
};

/**
 * Search Inventory by Name or Stock Room
 * GET /inventory/search?name=value&stockRoom=value
 */
exports.searchInventory = async (req, res) => {
    const { name, stockRoom } = req.query;

    try {
        let selector = {};

        if (name) {
            selector.name = { $regex: `(?i)${name}` }; // Case-insensitive regex search
        }

        if (stockRoom) {
            selector.stockRoom = stockRoom;
        }

        const result = await cloudant.postFind({
            db: dbName,
            selector,
        });

        const filteredInventory = result.result.docs.map((item) => ({
            _id: item._id,
            _rev: item._rev,
            name: item.name,
            stock: item.stock,
            price: item.price,
            stockRoom: item.stockRoom,
        }));

        res.status(200).json(filteredInventory);
    } catch (error) {
        console.error('Error searching inventory:', error);
        res.status(500).json({ error: 'Failed to search inventory' });
    }
};
