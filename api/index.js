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
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 1, // Maintain up to 1 socket connection
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0 // Disable mongoose buffering
    });
    
    cachedConnection = connection;
    console.log("✅ Connected to MongoDB");
    return connection;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Server is running on Vercel",
    timestamp: new Date().toISOString()
  });
});

// Public routes (no authentication required)
app.use("/api/auth", authRoutes);

// Protected routes (authentication required)
app.use("/api/invoices", authenticateToken, invoiceRoutes);
app.use("/api/clients", authenticateToken, clientRoutes);
app.use("/api/users", userRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "Fromagerie Invoice API", 
    version: "1.0.0",
    docs: "/api/health"
  });
});

// Connect to database before handling requests
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

export default app; 