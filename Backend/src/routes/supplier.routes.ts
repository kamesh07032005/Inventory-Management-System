import { Router } from 'express';
import {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier
} from '../controllers/supplier.controller';

const router = Router();

// GET /api/suppliers - Get all suppliers
router.get('/', getAllSuppliers);

// GET /api/suppliers/:id - Get a specific supplier
router.get('/:id', getSupplierById);

// POST /api/suppliers - Create a new supplier
router.post('/', createSupplier);

// PUT /api/suppliers/:id - Update a supplier
router.put('/:id', updateSupplier);

// DELETE /api/suppliers/:id - Delete a supplier
router.delete('/:id', deleteSupplier);

export default router;