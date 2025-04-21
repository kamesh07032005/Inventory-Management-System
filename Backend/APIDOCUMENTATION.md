# Inventory Management System - Backend

This is the backend for the Inventory Management System, built with Node.js, Express, TypeScript, and MySQL.

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- SQL Workbench or any MySQL client

### Database Setup

1. Create a new database in MySQL:

```sql
CREATE DATABASE inventory_management;
USE inventory_management;
```

2. The application will automatically create the tables when it first runs due to TypeORM's synchronize option. However, you can also manually create the tables using the following SQL script:

```sql
CREATE TABLE suppliers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  contactName VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  address VARCHAR(500),
  suppliedItems TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE inventory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  quantity INT DEFAULT 0,
  description VARCHAR(500),
  supplierId INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (supplierId) REFERENCES suppliers(id) ON DELETE SET NULL
);
```

### Environment Configuration

1. Update the `.env` file with your MySQL credentials:

```
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=inventory_management

PORT=3000
NODE_ENV=development
```

### Installation

1. Install dependencies:

```bash
npm install
```

2. Build the project:

```bash
npm run build
```

3. Start the development server:

```bash
npm run dev
```

## API Documentation

### Inventory Endpoints

#### GET /api/inventory

- Description: Get all inventory items
- Response:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Laptop",
      "category": "Electronics",
      "quantity": 10,
      "description": "High-performance laptops",
      "supplierId": 1,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET /api/inventory/:id

- Description: Get a specific inventory item by ID
- Response:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Laptop",
    "category": "Electronics",
    "quantity": 10,
    "description": "High-performance laptops",
    "supplierId": 1,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### POST /api/inventory

- Description: Create a new inventory item
- Request Body:

```json
{
  "name": "Laptop",
  "category": "Electronics",
  "quantity": 10,
  "description": "High-performance laptops",
  "supplierId": 1
}
```

- Response:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Laptop",
    "category": "Electronics",
    "quantity": 10,
    "description": "High-performance laptops",
    "supplierId": 1,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### PUT /api/inventory/:id

- Description: Update an existing inventory item
- Request Body:

```json
{
  "quantity": 15,
  "description": "Updated laptop description"
}
```

- Response:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Laptop",
    "category": "Electronics",
    "quantity": 15,
    "description": "Updated laptop description",
    "supplierId": 1,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### DELETE /api/inventory/:id

- Description: Delete an inventory item
- Response:

```json
{
  "success": true,
  "message": "Inventory item deleted successfully"
}
```

### Supplier Endpoints

#### GET /api/suppliers

- Description: Get all suppliers
- Response:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Tech Supplies Inc.",
      "contactName": "John Doe",
      "email": "john@techsupplies.com",
      "phone": "555-123-4567",
      "address": "123 Tech St, Silicon Valley, CA",
      "suppliedItems": ["Electronics", "Computers"],
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET /api/suppliers/:id

- Description: Get a specific supplier by ID
- Response:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Tech Supplies Inc.",
    "contactName": "John Doe",
    "email": "john@techsupplies.com",
    "phone": "555-123-4567",
    "address": "123 Tech St, Silicon Valley, CA",
    "suppliedItems": ["Electronics", "Computers"],
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### POST /api/suppliers

- Description: Create a new supplier
- Request Body:

```json
{
  "name": "Tech Supplies Inc.",
  "contactName": "John Doe",
  "email": "john@techsupplies.com",
  "phone": "555-123-4567",
  "address": "123 Tech St, Silicon Valley, CA",
  "suppliedItems": ["Electronics", "Computers"]
}
```

- Response:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Tech Supplies Inc.",
    "contactName": "John Doe",
    "email": "john@techsupplies.com",
    "phone": "555-123-4567",
    "address": "123 Tech St, Silicon Valley, CA",
    "suppliedItems": ["Electronics", "Computers"],
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### PUT /api/suppliers/:id

- Description: Update an existing supplier
- Request Body:

```json
{
  "contactName": "Jane Doe",
  "phone": "555-987-6543"
}
```

- Response:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Tech Supplies Inc.",
    "contactName": "Jane Doe",
    "email": "john@techsupplies.com",
    "phone": "555-987-6543",
    "address": "123 Tech St, Silicon Valley, CA",
    "suppliedItems": ["Electronics", "Computers"],
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### DELETE /api/suppliers/:id

- Description: Delete a supplier
- Response:

```json
{
  "success": true,
  "message": "Supplier deleted successfully"
}
```

### Error Responses

All endpoints may return the following error response format:

```json
{
  "success": false,
  "error": {
    "message": "Error message description",
    "code": "ERROR_CODE"
  }
}
```
