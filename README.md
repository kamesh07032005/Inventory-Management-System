# 🚀 Inventory Management System

A comprehensive full-stack web application for managing inventory, suppliers, products, and orders. This system helps businesses track their inventory levels, manage supplier relationships, and process orders efficiently.

![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![Tech Stack](https://img.shields.io/badge/Tech%20Stack-Angular%20%7C%20Node.js%20%7C%20MySQL-orange)

## 👋 Meet Our Team

This project is proudly developed by:
- **Team Representative**
- **Team Member 1**
- **Team Member 2**

We're excited to bring you this inventory management application and welcome your feedback!

## 💼 Overview

Inventory Management System is a modern platform that bridges the gap between inventory tracking and business operations. Built with Angular, Node.js (TypeScript), and MySQL, this application offers a seamless experience for managing products, suppliers, and orders with comprehensive tracking capabilities.

## ✨ Key Features

### For Inventory Managers
- **Product Management** - Add, update, delete, and view products
- **Supplier Management** - Track supplier information and relationships
- **Inventory Tracking** - Monitor stock levels and receive low stock alerts
- **Order Processing** - Create and manage purchase orders


## 🛠️ Technology Stack

### Frontend
- **Framework**: Angular 16
- **UI Library**: Angular Material
- **Language**: TypeScript
- **State Management**: Angular Services

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: TypeORM
- **API**: RESTful architecture

### Database
- **RDBMS**: MySQL

## 📁 Project Structure
```
.
├── backend/                # Server-side code
│   ├── src/
│   │   ├── controllers/    # API route handlers
│   │   ├── entities/       # Database models
│   │   ├── routes/         # API route definitions
│   │   └── server.ts       # Entry point
│   ├── .env                # Environment variables
│   └── package.json        # Backend dependencies
│
└── frontend/              # Client-side application
    ├── src/
    │   ├── app/           # Angular components
    │   ├── assets/        # Static resources
    │   └── environments/  # Environment configurations
    ├── angular.json       # Angular configuration
    └── package.json       # Frontend dependencies
```

## 🚀 Installation Guide

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- Angular CLI
- Git

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd Backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure the database connection in the `.env` file:
   ```
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=inventory_management
   PORT=3000
   ```

4. Start the server:
   ```
   npm run dev
   ```
   The server will run on http://localhost:3000

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd Frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   ng serve
   ```
   The application will be available at http://localhost:4200

## 📊 API Reference

### Product Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/products` | Get all products |
| POST   | `/api/products` | Create a new product |
| GET    | `/api/products/:id` | Get a specific product |
| PUT    | `/api/products/:id` | Update product details |
| DELETE | `/api/products/:id` | Delete a product |

### Supplier Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/suppliers` | Get all suppliers |
| POST   | `/api/suppliers` | Create a new supplier |
| GET    | `/api/suppliers/:id` | Get a specific supplier |
| PUT    | `/api/suppliers/:id` | Update supplier details |
| DELETE | `/api/suppliers/:id` | Delete a supplier |

### Order Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/orders` | Get all orders |
| POST   | `/api/orders` | Create a new order |
| GET    | `/api/orders/:id` | Get a specific order |
| PUT    | `/api/orders/:id` | Update order details |
| DELETE | `/api/orders/:id` | Delete an order |

## 📋 Application Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/products` | ProductListComponent | Main page displaying all products |
| `/products/new` | ProductFormComponent | Form to add a new product |
| `/products/edit/:id` | ProductFormComponent | Edit an existing product |
| `/products/:id` | ProductDetailsComponent | View detailed product information |
| `/suppliers` | SupplierListComponent | View all suppliers |
| `/orders` | OrderListComponent | View all orders |


