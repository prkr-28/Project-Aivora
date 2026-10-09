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
app.use(express.json()); //Express middleware that parses incoming JSON request bodies and makes the data available in req.body

//app.use(express.urlencoded({ extended: true })); is Express middleware that parses incoming form data encoded as URL-encoded data and makes it available in req.body
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

    const server = http.createServer(app);
    server.listen(config.port, () => {
      console.log(`Server running on port ${config.port}, MongoDB: Connected`);
    });

    server.on("error", (err) => {
      console.error("Server error:", err.message);
      process.exit(1);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};
startServer();
export default app;
