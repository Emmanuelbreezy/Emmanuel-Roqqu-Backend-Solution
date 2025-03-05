# Roqqu-Assessment-Backend-Solution

### By Emmanuel

## Overview

This is a backend API solution built using **Node.js, Express, and TypeORM** with **SQLite** for data persistence. The project follows the requirement.

## Live URL

[🚀 Live URL](https://api-roqqu.onrender.com) #https://api-roqqu.onrender.com

## API Documentation

[📄 Postman Documentation](https://documenter.getpostman.com/view/18783154/2sAYdkJ9qZ)

## 📌 Notes

- The project uses **TypeORM** for database operations.
- Jest & Supertest are used for **testing**.
- **SQLite** is used as the database for easy local testing.
- The API follows **Best practices** with proper error handling.
---

---
### Clone the Repository

```sh
git clone https://github.com/Emmanuelbreezy/Emmanuel-Roqqu-Backend-Solution
cd Emmanuel-Roqqu-Backend-Solution
```

### Install Dependencies

```sh
npm install
```

---

## 🛠️ Database Setup

This project uses **TypeORM** with SQLite. To set up the database:

### 1️⃣ Run Migrations

```sh
npm run db:migrate
```

This will create the necessary tables in the SQLite database.

### (Optional) Drop Database

To completely reset the database:

```sh
npm run db:drop
```

## 📌 Environment Variables

Create a `.env` file in the root directory and configure the following:

```sh
PORT=8000
NODE_ENV=development
```

---

## 🚀 Running the Server

To start the development server:

```sh
npm run dev
```

This will run the server using `ts-node-dev` for hot-reloading.

For production, build and start the server:

```sh
npm run build
npm run start
```

The API will be available at `http://localhost:8000` (or your configured port).

---

## 🧪 Running Tests

The project includes **unit tests** and **API tests** using **Jest & Supertest**.

### Run Unit Tests Only

```sh
npm run test:unit
```

### Run API Tests Only

```sh
npm run test:api
```


🎯 _Thank You!_ 🚀
