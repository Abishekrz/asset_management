# Asset Management System

A simple Asset Management System built using Node.js, Express, PostgreSQL, Sequelize ORM, and Jade.

## Features

- Employee Management
- Asset Category Management
- Asset Management
- Issue Assets to Employees
- Return Assets
- Stock Management
- Asset History
- Bootstrap-based UI

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- Jade (Pug)
- Bootstrap
- CSS

## Project Structure

```
asset_management/
│
├── controllers/
├── models/
├── routes/
├── views/
├── public/
├── config/
├── app.js
├── package.json
└── query.sql
```

## Installation

Clone the repository:

```bash
git clone https://github.com/Abishekrz/asset_management.git
```

Move into the project folder:

```bash
cd asset_management
```

Install dependencies:

```bash
npm install
```

Configure your PostgreSQL database and update the database configuration.

Start the application:

```bash
node app.js
```

or

```bash
nodemon app.js
```

The application will run at:

```
http://localhost:3000
```

## Database

Create the required PostgreSQL database and execute the SQL script available in:

```
query.sql
```

## Author

**R S Abishek**

GitHub: https://github.com/Abishekrz