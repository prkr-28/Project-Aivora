import { Router } from "express";
import {
  generateInsights,
  getInsightsByGoal,
  getLatestInsight,
} from "../controllers/insight.controller.js";
import { authenticate } from "../middleware/auth.js";
import { aiLimiter } from "../middleware/rateLimiter.js";
const router = Router();

// All routes require authentication
router.use(authenticate);

// Routes
router.post("/generate/:goalId", aiLimiter, generateInsights);
router.get("/goal/:goalId", getInsightsByGoal);
router.get("/goal/:goalId/latest", getLatestInsight);
export default router;
