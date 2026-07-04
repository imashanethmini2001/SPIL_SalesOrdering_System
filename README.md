# SPIL Sales Ordering System

A full-stack Sales Order Management web application developed for the **SPIL Labs Pvt Ltd Intern Software Engineer Technical Assessment**.

## Technologies Used

### Backend
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- Layered Architecture
- REST API
- Dependency Injection

### Frontend
- React
- React Hooks
- React Router
- Axios
- Tailwind CSS
- Redux Toolkit structure

## Features

- Home screen opens first
- Sales order list grid
- Add new sales order
- Edit existing sales order by double-clicking a row
- Customer dropdown loaded from database
- Auto-fill customer address
- Editable address fields
- Item code dropdown
- Item description dropdown
- Auto-fill item price
- Add multiple order items
- Automatic line calculations
- Automatic total calculations
- Save sales order
- Update sales order
- Print sales order

## Calculation Logic

```text
Excl Amount = Quantity × Price
Tax Amount  = Excl Amount × Tax Rate / 100
Incl Amount = Excl Amount + Tax Amount

## project structure
SPIL-Sales-Order-System
│
├── backend
│   └── SPILSalesOrder.API
│       ├── Controllers
│       ├── Models
│       │   └── DTOs
│       ├── Application
│       │   ├── Interfaces
│       │   └── Services
│       ├── Domain
│       │   └── Entities
│       ├── Infrastructure
│       │   ├── Data
│       │   └── Repositories
│       ├── Program.cs
│       └── appsettings.json
│
└── frontend
    └── spil-sales-order-client
        └── src
            ├── components
            ├── pages
            ├── redux
            ├── services
            ├── hooks
            └── utils

Database Tables
Clients
Items
SalesOrders
SalesOrderItems

How to Run

Backend
cd backend/SPILSalesOrder.API
dotnet restore
dotnet ef database update
dotnet run

Frontend
cd frontend/spil-sales-order-client
npm install
npm run dev

API Endpoints
GET    /api/clients
GET    /api/items
GET    /api/salesorders
GET    /api/salesorders/{id}
POST   /api/salesorders
PUT    /api/salesorders/{id}

Author

Imasha Kumarasinghe
Software Engineering Undergraduate
Sabaragamuwa University of Sri Lanka