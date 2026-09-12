import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDatabase from "./config/database.js";
import config from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { apiLimiter } from "./middleware/rateLimiter.js";

// Import routes
import authRoutes from "./routes/auth.routes.js";
import goalRoutes from "./routes/goal.routes.js";
import progressRoutes from "./routes/progress.routes.js";
import insightRoutes from "./routes/insight.routes.js";
import pdfRoutes from "./routes/pdf.routes.js";
import chatRoutes from "./routes/chat.routes.js";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
app.set("trust proxy", 1);

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (config.frontendUrls.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

// Morgan logger - different formats for dev/production
if (config.nodeEnv === "development") {
  app.use(morgan("dev")); // Colored, concise output for development
} else {
  app.use(morgan("combined")); // Apache-style logs for production
}
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

// Apply rate limiting to all routes
app.use("/api", apiLimiter);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Aivora API is running",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/insights", insightRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/chat", chatRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDatabase();
    console.log("Database connected, starting server...");
    const PORT =
      typeof config.port === "string" ? parseInt(config.port) : config.port;
    const server = http.createServer(app);
    server.listen(config.port, () => {
      console.log(`
╔══════════════════════════════════════════════╗
║   🚀 Aivora API Server                       ║
║                                              ║
║   Environment: ${config.nodeEnv.padEnd(28)}  ║
║   Port: ${String(config.port).padEnd(34)}   ║
║   Database: Connected                        ║
║   URL: http://localhost:${PORT}                 ║
║                                              ║
╚══════════════════════════════════════════════╝
      `);
      console.log("✓ Server is now listening for requests");
    });
    server.on("error", (err) => {
      console.error("Server error:", err);
      process.exit(1);
    });
  } catch (error) {
    console.error("✗ Failed to start server:", error);
    process.exit(1);
  }
};
startServer();
export default app;
