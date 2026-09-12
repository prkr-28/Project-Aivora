import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { generateReport } from "../controllers/pdf.controller.js";
const router = Router();

// All routes require authentication
router.use(authenticate);

// Generate PDF report for a goal
router.get("/goal/:goalId/report", generateReport);
export default router;
