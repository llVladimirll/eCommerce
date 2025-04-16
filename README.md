# E-Commerce API

This is a simple E-Commerce API built with Express.js, Drizzle ORM, & PostgreSQL.

## Features
- Manage products (CRUD operations).
- Manage orders (create orders and calculate total price).

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/e-commerce-api.git
   cd e-commerce-api

2. **Install dependencies:**
    ```bash
    npm install
3. **Configure Database:**
Edit db/db.ts with your PostgreSQL connection details.

Create the database and tables:
    
    CREATE DATABASE your_database;

    CREATE TABLE products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price INTEGER NOT NULL
    );

    CREATE TABLE orders (
      id SERIAL PRIMARY KEY,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      total_price INTEGER NOT NULL,
      FOREIGN KEY (product_id) REFERENCES products(id)
    );


## Running the App

1. **Start the server:**
      ```bash
      npm run dev

2. **API Endpoints:**

GET /products: Get all products.

POST /products: Create a new product.

PUT /products/:id: Update an existing product.

DELETE /products/:id: Delete a product.

POST /orders: Create an order.
