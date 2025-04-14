import express from 'express';
import cors from 'cors';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import inventoryRoutes from './routes/inventory.routes';
import supplierRoutes from './routes/supplier.routes';
import { Inventory } from './entities/Inventory';
import { Supplier } from './entities/Supplier';
import 'reflect-metadata';

// Load environment variables
dotenv.config();

// Create and export the DataSource instance
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'inventory_management',
  entities: [Inventory, Supplier],
  synchronize: true, // Be careful with this in production
});

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/inventory', inventoryRoutes);
app.use('/api/suppliers', supplierRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Inventory Management System API');
});

// Database connection and server start
const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Connected to MySQL database');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
};

startServer();