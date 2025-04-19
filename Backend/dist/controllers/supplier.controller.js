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
exports.deleteSupplier = exports.updateSupplier = exports.createSupplier = exports.getSupplierById = exports.getAllSuppliers = void 0;
const server_1 = require("../server");
const Supplier_1 = require("../entities/Supplier");
const Inventory_1 = require("../entities/Inventory");
// Get all suppliers
const getAllSuppliers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const supplierRepository = server_1.AppDataSource.getRepository(Supplier_1.Supplier);
        const suppliers = yield supplierRepository.find();
        res.status(200).json(suppliers);
    }
    catch (error) {
        console.error('Error fetching suppliers:', error);
        res.status(500).json({ message: 'Failed to fetch suppliers', error });
    }
});
exports.getAllSuppliers = getAllSuppliers;
// Get a specific supplier by ID
const getSupplierById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'Invalid supplier ID' });
            return;
        }
        const supplierRepository = server_1.AppDataSource.getRepository(Supplier_1.Supplier);
        const supplier = yield supplierRepository.findOne({
            where: { id },
            relations: ['inventoryItems'],
        });
        if (!supplier) {
            res.status(404).json({ message: 'Supplier not found' });
            return;
        }
        res.status(200).json(supplier);
    }
    catch (error) {
        console.error('Error fetching supplier:', error);
        res.status(500).json({ message: 'Failed to fetch supplier', error });
    }
});
exports.getSupplierById = getSupplierById;
// Create a new supplier
const createSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, contactName, email, phone, address, suppliedItems } = req.body;
        // Validate required fields
        if (!name || !contactName || !email || !phone) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }
        const supplierRepository = server_1.AppDataSource.getRepository(Supplier_1.Supplier);
        const newSupplier = supplierRepository.create({
            name,
            contactName,
            email,
            phone,
            address,
            suppliedItems,
        });
        yield supplierRepository.save(newSupplier);
        res.status(201).json(newSupplier);
    }
    catch (error) {
        console.error('Error creating supplier:', error);
        res.status(500).json({ message: 'Failed to create supplier', error });
    }
});
exports.createSupplier = createSupplier;
// Update an existing supplier
const updateSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'Invalid supplier ID' });
            return;
        }
        const { name, contactName, email, phone, address, suppliedItems } = req.body;
        // Check if supplier exists
        const supplierRepository = server_1.AppDataSource.getRepository(Supplier_1.Supplier);
        const supplier = yield supplierRepository.findOne({
            where: { id }
        });
        if (!supplier) {
            res.status(404).json({ message: 'Supplier not found' });
            return;
        }
        // Update the supplier
        yield supplierRepository.update(id, {
            name: name || supplier.name,
            contactName: contactName || supplier.contactName,
            email: email || supplier.email,
            phone: phone || supplier.phone,
            address: address !== undefined ? address : supplier.address,
            suppliedItems: suppliedItems || supplier.suppliedItems,
        });
        // Get the updated supplier
        const updatedSupplier = yield supplierRepository.findOne({
            where: { id }
        });
        res.status(200).json(updatedSupplier);
    }
    catch (error) {
        console.error('Error updating supplier:', error);
        res.status(500).json({ message: 'Failed to update supplier', error });
    }
});
exports.updateSupplier = updateSupplier;
// Delete a supplier
const deleteSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'Invalid supplier ID' });
            return;
        }
        const supplierRepository = server_1.AppDataSource.getRepository(Supplier_1.Supplier);
        const supplier = yield supplierRepository.findOne({
            where: { id }
        });
        if (!supplier) {
            res.status(404).json({ message: 'Supplier not found' });
            return;
        }
        // Check if supplier has inventory items
        const inventoryRepository = server_1.AppDataSource.getRepository(Inventory_1.Inventory);
        const inventoryItems = yield inventoryRepository.find({
            where: { supplierId: id }
        });
        if (inventoryItems.length > 0) {
            // Option 1: Prevent deletion if supplier has inventory items
            // res.status(400).json({ message: 'Cannot delete supplier with associated inventory items' });
            // return;
            // Option 2: Set supplierId to null for associated inventory items
            yield inventoryRepository.update({ supplierId: id }, { supplierId: null } // TypeORM requires this casting
            );
        }
        yield supplierRepository.delete(id);
        res.status(200).json({ message: 'Supplier deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting supplier:', error);
        res.status(500).json({ message: 'Failed to delete supplier', error });
    }
});
exports.deleteSupplier = deleteSupplier;
