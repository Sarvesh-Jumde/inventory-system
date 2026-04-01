# Serverless Inventory Management System

A cloud-native, **Event-Driven Inventory System** built with **Azure Functions (v4)** and **MongoDB Atlas**. This project demonstrates professional backend architecture, including asynchronous messaging, scheduled jobs, and strict runtime validation.

---

## 🏗 System Architecture

The system is designed to be highly decoupled and scalable:

- **Producer (HTTP Trigger)**: `updateStock.ts` detects when stock falls below a threshold and pushes a message to an Azure Storage Queue.
- **Consumer (Queue Trigger)**: `lowStockQueueTrigger.ts` wakes up instantly to process the alert (e.g., sending notifications) without slowing down the main API.
- **Scheduler (Timer Trigger)**: `dailyReport.ts` runs on a CRON schedule (daily) to scan the database and generate a summary report of all items requiring restock.

---

## 🌟 Key Features

- **RESTful API**: Full CRUD operations for product management.
- **Event-Driven Alerts**: Uses **Azure Storage Queues** to separate stock updates from notification logic.
- **Scheduled Audits**: A **Timer Trigger** that acts as a safety net for inventory health.
- **Runtime Validation**: Uses **Zod** to validate incoming HTTP data before it interacts with MongoDB.
- **TypeScript Singleton**: Optimized MongoDB connection management for serverless environments.

---

## 🛠 Tech Stack

- **Language**: TypeScript
- **Runtime**: Node.js (Azure Functions v4 Model)
- **Database**: MongoDB Atlas (NoSQL)
- **Messaging**: Azure Storage Queues
- **Validation**: Zod Schema Validation

---

## 💻 Local Setup Instructions

### 1. Prerequisites

- **Node.js** (v18 or v20)
- **Azure Functions Core Tools v4**
- **Azurite**: VS Code extension to emulate Azure Storage locally.
- **MongoDB Atlas**: A free cluster and connection string.

### 2. Environment Configuration

    Create a `local.settings.json` file in the root directory (this file is ignored by git):

{
"IsEncrypted": false,
"Values": {
"AzureWebJobsStorage": "UseDevelopmentStorage=true",
"FUNCTIONS_WORKER_RUNTIME": "node",
"MongoDBAtlasConnectionString": "YOUR_MONGODB_ATLAS_CONNECTION_STRING",
"DatabaseName": "inventory_db"
}
}

### 3. Running the App

# Install dependencies

npm install

# Compile TypeScript

npm run build

# Start the Functions host

func start

### 4. Testing the Flow

Add Product: POST /api/addProduct with a JSON body (name, sku, price, stockQuantity, lowStockThreshold).

Trigger Alert: PATCH /api/updateStock and set the quantity below the threshold.

Observe Logs: You will see updateStock finish instantly, followed by lowStockQueueTrigger processing the alert in the background.

```

```
