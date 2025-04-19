import { Router } from 'express';
import {
  getAllInventory,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventory
} from '../controllers/inventory.controller';

const router = Router();

// GET /api/inventory - Get all inventory items
router.get('/', getAllInventory);

// GET /api/inventory/:id - Get a specific inventory item
router.get('/:id', getInventoryById);

// POST /api/inventory - Create a new inventory item
router.post('/', createInventory);

// PUT /api/inventory/:id - Update an inventory item
router.put('/:id', updateInventory);

// DELETE /api/inventory/:id - Delete an inventory item
router.delete('/:id', deleteInventory);

export default router;