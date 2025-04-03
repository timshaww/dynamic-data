# Pizza Ordering System

A pizza ordering system built with Node.js, Express, Sequelize, SQLite3, and Bootstrap, featuring full CRUD operations for managing customers and orders.

## Features

### Customer Management
- View all customers with basic information
- Add, edit and delete customers
- View detailed customer information
- See all orders associated with a customer

### Order Management
- View all orders with basic information
- Create, edit and delete orders
- View detailed order information
- Update order status (New, Processing, Completed)

## Database Structure

### Customers Table
- First Name
- Last Name
- Address
- City
- State
- Zip
- Phone
- Email

### Orders Table
- Size (S, M, L, XL)
- Toppings
- Notes
- Status (New, Processing, Completed)
- Customer relationship

## Requirements

- Node.js (v14 or higher)
- NPM (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pizza-ordering
```

2. Install dependencies:
```bash
npm install
```

3. Start the application:
```bash
npm start
```

4. For development with auto-reload:
```bash
npm run dev
```

5. Access the application in your browser:
```
http://localhost:3007
```

## Dependencies

- express: Web framework
- express-handlebars: Template engine
- sequelize: ORM for database operations
- sqlite3: Database engine
- body-parser: Request body parsing
- method-override: Support for PUT and DELETE requests in forms
- moment: Date formatting

## License

ISC 