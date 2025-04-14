"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supplier_controller_1 = require("../controllers/supplier.controller");
const router = (0, express_1.Router)();
// GET /api/suppliers - Get all suppliers
router.get('/', supplier_controller_1.getAllSuppliers);
// GET /api/suppliers/:id - Get a specific supplier
router.get('/:id', supplier_controller_1.getSupplierById);
// POST /api/suppliers - Create a new supplier
router.post('/', supplier_controller_1.createSupplier);
// PUT /api/suppliers/:id - Update a supplier
router.put('/:id', supplier_controller_1.updateSupplier);
// DELETE /api/suppliers/:id - Delete a supplier
router.delete('/:id', supplier_controller_1.deleteSupplier);
exports.default = router;
