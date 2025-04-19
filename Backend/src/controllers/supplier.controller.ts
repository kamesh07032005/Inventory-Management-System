import { Request, Response } from 'express';
import { AppDataSource } from '../server';
import { Supplier } from '../entities/Supplier';
import { Inventory } from '../entities/Inventory';

// Get all suppliers
export const getAllSuppliers = async (req: Request, res: Response): Promise<void> => {
  try {
    const supplierRepository = AppDataSource.getRepository(Supplier);
    const suppliers = await supplierRepository.find();
    res.status(200).json(suppliers);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ message: 'Failed to fetch suppliers', error });
  }
};

// Get a specific supplier by ID
export const getSupplierById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid supplier ID' });
      return;
    }

    const supplierRepository = AppDataSource.getRepository(Supplier);
    const supplier = await supplierRepository.findOne({
      where: { id },
      relations: ['inventoryItems'],
    });

    if (!supplier) {
      res.status(404).json({ message: 'Supplier not found' });
      return;
    }

    res.status(200).json(supplier);
  } catch (error) {
    console.error('Error fetching supplier:', error);
    res.status(500).json({ message: 'Failed to fetch supplier', error });
  }
};

// Create a new supplier
export const createSupplier = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, contactName, email, phone, address } = req.body;

    // Validate required fields
    if (!name || !contactName || !email || !phone) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const supplierRepository = AppDataSource.getRepository(Supplier);
    const newSupplier = supplierRepository.create({
      name,
      contactName,
      email,
      phone,
      address
    });

    await supplierRepository.save(newSupplier);
    res.status(201).json(newSupplier);
  } catch (error) {
    console.error('Error creating supplier:', error);
    res.status(500).json({ message: 'Failed to create supplier', error });
  }
};

// Update an existing supplier
export const updateSupplier = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid supplier ID' });
      return;
    }

    const { name, contactName, email, phone, address } = req.body;

    // Check if supplier exists
    const supplierRepository = AppDataSource.getRepository(Supplier);
    const supplier = await supplierRepository.findOne({
      where: { id }
    });

    if (!supplier) {
      res.status(404).json({ message: 'Supplier not found' });
      return;
    }

    // Update the supplier
    await supplierRepository.update(id, {
      name: name || supplier.name,
      contactName: contactName || supplier.contactName,
      email: email || supplier.email,
      phone: phone || supplier.phone,
      address: address !== undefined ? address : supplier.address
    });

    // Get the updated supplier
    const updatedSupplier = await supplierRepository.findOne({
      where: { id }
    });

    res.status(200).json(updatedSupplier);
  } catch (error) {
    console.error('Error updating supplier:', error);
    res.status(500).json({ message: 'Failed to update supplier', error });
  }
};

// Delete a supplier
export const deleteSupplier = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid supplier ID' });
      return;
    }

    const supplierRepository = AppDataSource.getRepository(Supplier);
    const supplier = await supplierRepository.findOne({
      where: { id }
    });

    if (!supplier) {
      res.status(404).json({ message: 'Supplier not found' });
      return;
    }

    // Check if supplier has inventory items
    const inventoryRepository = AppDataSource.getRepository(Inventory);
    const inventoryItems = await inventoryRepository.find({
      where: { supplierId: id }
    });

    if (inventoryItems.length > 0) {
      // Option 1: Prevent deletion if supplier has inventory items
      // res.status(400).json({ message: 'Cannot delete supplier with associated inventory items' });
      // return;

      // Option 2: Set supplierId to null for associated inventory items
      await inventoryRepository.update(
        { supplierId: id },
        { supplierId: null as any } // TypeORM requires this casting
      );
    }

    await supplierRepository.delete(id);
    res.status(200).json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({ message: 'Failed to delete supplier', error });
  }
};