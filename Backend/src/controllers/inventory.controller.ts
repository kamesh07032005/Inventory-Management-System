import { Request, Response } from 'express';
import { AppDataSource } from '../server';
import { Inventory } from '../entities/Inventory';
import { Supplier } from '../entities/Supplier';

// Get all inventory items
export const getAllInventory = async (req: Request, res: Response): Promise<void> => {
  try {
    const inventoryRepository = AppDataSource.getRepository(Inventory);
    const inventory = await inventoryRepository.find({
      relations: ['supplier'],
    });

    // Map to include supplier name for frontend display
    const inventoryWithSupplierName = inventory.map(item => ({
      ...item,
      supplierName: item.supplier ? item.supplier.name : null
    }));

    res.status(200).json(inventoryWithSupplierName);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ message: 'Failed to fetch inventory items', error });
  }
};

// Get a specific inventory item by ID
export const getInventoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid inventory ID' });
      return;
    }

    const inventoryRepository = AppDataSource.getRepository(Inventory);
    const item = await inventoryRepository.findOne({
      where: { id },
      relations: ['supplier'],
    });

    if (!item) {
      res.status(404).json({ message: 'Inventory item not found' });
      return;
    }

    // Include supplier name
    const itemWithSupplierName = {
      ...item,
      supplierName: item.supplier ? item.supplier.name : null
    };

    res.status(200).json(itemWithSupplierName);
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    res.status(500).json({ message: 'Failed to fetch inventory item', error });
  }
};

// Create a new inventory item
export const createInventory = async (req: Request, res: Response): Promise<void> => {
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
    const supplierRepository = AppDataSource.getRepository(Supplier);
    const supplier = await supplierRepository.findOne({
      where: { id: supplierId }
    });

    if (!supplier) {
      res.status(404).json({ message: 'Supplier not found' });
      return;
    }

    const inventoryRepository = AppDataSource.getRepository(Inventory);
    const newItem = inventoryRepository.create({
      name,
      category,
      quantity,
      description,
      supplierId,
    });

    await inventoryRepository.save(newItem);

    // Include supplier name in response
    const savedItem = {
      ...newItem,
      supplierName: supplier.name
    };

    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Error creating inventory item:', error);
    res.status(500).json({ message: 'Failed to create inventory item', error });
  }
};

// Update an existing inventory item
export const updateInventory = async (req: Request, res: Response): Promise<void> => {
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
    const inventoryRepository = AppDataSource.getRepository(Inventory);
    const item = await inventoryRepository.findOne({
      where: { id }
    });

    if (!item) {
      res.status(404).json({ message: 'Inventory item not found' });
      return;
    }

    // Check if supplier exists if supplierId is provided
    if (supplierId) {
      const supplierRepository = AppDataSource.getRepository(Supplier);
      const supplier = await supplierRepository.findOne({
        where: { id: supplierId }
      });

      if (!supplier) {
        res.status(404).json({ message: 'Supplier not found' });
        return;
      }
    }

    // Update the item
    await inventoryRepository.update(id, {
      name: name || item.name,
      category: category || item.category,
      quantity: quantity !== undefined ? quantity : item.quantity,
      description: description !== undefined ? description : item.description,
      supplierId: supplierId || item.supplierId,
    });

    // Get the updated item with supplier relation
    const updatedItem = await inventoryRepository.findOne({
      where: { id },
      relations: ['supplier'],
    });

    // Include supplier name
    const itemWithSupplierName = {
      ...updatedItem,
      supplierName: updatedItem?.supplier ? updatedItem.supplier.name : null
    };

    res.status(200).json(itemWithSupplierName);
  } catch (error) {
    console.error('Error updating inventory item:', error);
    res.status(500).json({ message: 'Failed to update inventory item', error });
  }
};

// Delete an inventory item
export const deleteInventory = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid inventory ID' });
      return;
    }

    const inventoryRepository = AppDataSource.getRepository(Inventory);
    const item = await inventoryRepository.findOne({
      where: { id }
    });

    if (!item) {
      res.status(404).json({ message: 'Inventory item not found' });
      return;
    }

    await inventoryRepository.delete(id);
    res.status(200).json({ message: 'Inventory item deleted successfully' });
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    res.status(500).json({ message: 'Failed to delete inventory item', error });
  }
};