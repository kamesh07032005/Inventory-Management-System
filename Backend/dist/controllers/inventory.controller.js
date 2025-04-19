"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInventory = exports.updateInventory = exports.createInventory = exports.getInventoryById = exports.getAllInventory = void 0;
const server_1 = require("../server");
const Inventory_1 = require("../entities/Inventory");
const Supplier_1 = require("../entities/Supplier");
// Get all inventory items
const getAllInventory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const inventoryRepository = server_1.AppDataSource.getRepository(Inventory_1.Inventory);
        const inventory = yield inventoryRepository.find({
            relations: ['supplier'],
        });
        // Map to include supplier name for frontend display
        const inventoryWithSupplierName = inventory.map(item => (Object.assign(Object.assign({}, item), { supplierName: item.supplier ? item.supplier.name : null })));
        res.status(200).json(inventoryWithSupplierName);
    }
    catch (error) {
        console.error('Error fetching inventory:', error);
        res.status(500).json({ message: 'Failed to fetch inventory items', error });
    }
});
exports.getAllInventory = getAllInventory;
// Get a specific inventory item by ID
const getInventoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'Invalid inventory ID' });
            return;
        }
        const inventoryRepository = server_1.AppDataSource.getRepository(Inventory_1.Inventory);
        const item = yield inventoryRepository.findOne({
            where: { id },
            relations: ['supplier'],
        });
        if (!item) {
            res.status(404).json({ message: 'Inventory item not found' });
            return;
        }
        // Include supplier name
        const itemWithSupplierName = Object.assign(Object.assign({}, item), { supplierName: item.supplier ? item.supplier.name : null });
        res.status(200).json(itemWithSupplierName);
    }
    catch (error) {
        console.error('Error fetching inventory item:', error);
        res.status(500).json({ message: 'Failed to fetch inventory item', error });
    }
});
exports.getInventoryById = getInventoryById;
// Create a new inventory item
const createInventory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, category, quantity, description, supplierId } = req.body;
        // Validate required fields
        if (!name || !category || quantity === undefined || !supplierId) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }
        // Validate quantity is not negative
        if (quantity < 0) {
            res.status(400).json({ message: 'Quantity cannot be negative' });
            return;
        }
        // Check if supplier exists
        const supplierRepository = server_1.AppDataSource.getRepository(Supplier_1.Supplier);
        const supplier = yield supplierRepository.findOne({
            where: { id: supplierId }
        });
        if (!supplier) {
            res.status(404).json({ message: 'Supplier not found' });
            return;
        }
        const inventoryRepository = server_1.AppDataSource.getRepository(Inventory_1.Inventory);
        const newItem = inventoryRepository.create({
            name,
            category,
            quantity,
            description,
            supplierId,
        });
        yield inventoryRepository.save(newItem);
        // Include supplier name in response
        const savedItem = Object.assign(Object.assign({}, newItem), { supplierName: supplier.name });
        res.status(201).json(savedItem);
    }
    catch (error) {
        console.error('Error creating inventory item:', error);
        res.status(500).json({ message: 'Failed to create inventory item', error });
    }
});
exports.createInventory = createInventory;
// Update an existing inventory item
const updateInventory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'Invalid inventory ID' });
            return;
        }
        const { name, category, quantity, description, supplierId } = req.body;
        // Validate quantity is not negative if provided
        if (quantity !== undefined && quantity < 0) {
            res.status(400).json({ message: 'Quantity cannot be negative' });
            return;
        }
        // Check if inventory item exists
        const inventoryRepository = server_1.AppDataSource.getRepository(Inventory_1.Inventory);
        const item = yield inventoryRepository.findOne({
            where: { id }
        });
        if (!item) {
            res.status(404).json({ message: 'Inventory item not found' });
            return;
        }
        // Check if supplier exists if supplierId is provided
        if (supplierId) {
            const supplierRepository = server_1.AppDataSource.getRepository(Supplier_1.Supplier);
            const supplier = yield supplierRepository.findOne({
                where: { id: supplierId }
            });
            if (!supplier) {
                res.status(404).json({ message: 'Supplier not found' });
                return;
            }
        }
        // Update the item
        yield inventoryRepository.update(id, {
            name: name || item.name,
            category: category || item.category,
            quantity: quantity !== undefined ? quantity : item.quantity,
            description: description !== undefined ? description : item.description,
            supplierId: supplierId || item.supplierId,
        });
        // Get the updated item with supplier relation
        const updatedItem = yield inventoryRepository.findOne({
            where: { id },
            relations: ['supplier'],
        });
        // Include supplier name
        const itemWithSupplierName = Object.assign(Object.assign({}, updatedItem), { supplierName: (updatedItem === null || updatedItem === void 0 ? void 0 : updatedItem.supplier) ? updatedItem.supplier.name : null });
        res.status(200).json(itemWithSupplierName);
    }
    catch (error) {
        console.error('Error updating inventory item:', error);
        res.status(500).json({ message: 'Failed to update inventory item', error });
    }
});
exports.updateInventory = updateInventory;
// Delete an inventory item
const deleteInventory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'Invalid inventory ID' });
            return;
        }
        const inventoryRepository = server_1.AppDataSource.getRepository(Inventory_1.Inventory);
        const item = yield inventoryRepository.findOne({
            where: { id }
        });
        if (!item) {
            res.status(404).json({ message: 'Inventory item not found' });
            return;
        }
        yield inventoryRepository.delete(id);
        res.status(200).json({ message: 'Inventory item deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting inventory item:', error);
        res.status(500).json({ message: 'Failed to delete inventory item', error });
    }
});
exports.deleteInventory = deleteInventory;
