import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import invoiceRoutes from "../routes/invoiceRoutes.js";
import clientRoutes from "../routes/clientRoutes.js";
import authRoutes from "../routes/authRoutes.js";
import userRoutes from "../routes/userRoutes.js";
import { authenticateToken } from "../middleware/auth.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// MongoDB connection with connection pooling for serverless
let cachedConnection = null;

async function connectToDatabase() {
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 1,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      maxIdleTimeMS: 30000,
      family: 4
    });
    
    cachedConnection = connection;
    return connection;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}

// Connect to database before handling requests
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    res.status(500).json({ 
      error: "Database connection failed",
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "Fromagerie Invoice API", 
    version: "1.0.0",
    status: "✅ API is running",
    routes: {
      "Health Check": "GET /api/health",
      "Authentication": {
        "Login": "POST /api/auth/login",
        "Register": "POST /api/auth/register",
        "Get User": "GET /api/auth/me",
        "Logout": "POST /api/auth/logout",
        "Change Password": "PUT /api/auth/change-password"
      },
      "Invoices": {
        "List": "GET /api/invoices",
        "Create": "POST /api/invoices",
        "Get": "GET /api/invoices/:id",
        "Update": "PUT /api/invoices/:id",
        "Delete": "DELETE /api/invoices/:id"
      },
      "Clients": {
        "List": "GET /api/clients",
        "Create": "POST /api/clients",
        "Get": "GET /api/clients/:id",
        "Update": "PUT /api/clients/:id",
        "Delete": "DELETE /api/clients/:id"
      },
      "Users": "GET /api/users (admin only)"
    },
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Server is running on Vercel",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString()
  });
});

// Public routes (no authentication required)
app.use("/api/auth", authRoutes);

// Protected routes (authentication required)
app.use("/api/invoices", authenticateToken, invoiceRoutes);
app.use("/api/clients", authenticateToken, clientRoutes);
app.use("/api/users", userRoutes);

// 404 handler for undefined routes
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `The route ${req.originalUrl} does not exist`,
    hint: "Try /api/auth/login instead of /auth/login",
    availableRoutes: [
      "GET /",
      "GET /api/health", 
      "POST /api/auth/login",
      "POST /api/auth/register",
      "GET /api/auth/me",
      "GET /api/invoices",
      "GET /api/clients", 
      "GET /api/users"
    ],
    timestamp: new Date().toISOString()
  });
});

export default app; 