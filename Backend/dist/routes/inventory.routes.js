"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inventory_controller_1 = require("../controllers/inventory.controller");
const router = (0, express_1.Router)();
// GET /api/inventory - Get all inventory items
router.get('/', inventory_controller_1.getAllInventory);
// GET /api/inventory/:id - Get a specific inventory item
router.get('/:id', inventory_controller_1.getInventoryById);
// POST /api/inventory - Create a new inventory item
router.post('/', inventory_controller_1.createInventory);
// PUT /api/inventory/:id - Update an inventory item
router.put('/:id', inventory_controller_1.updateInventory);
// DELETE /api/inventory/:id - Delete an inventory item
router.delete('/:id', inventory_controller_1.deleteInventory);
exports.default = router;
