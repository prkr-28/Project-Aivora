import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { aiLimiter } from "../middleware/rateLimiter.js";
import { chatWithSupport } from "../controllers/chat.controller.js";
const router = Router();

// All chat routes require authentication
router.use(authenticate);

// Gemini-powered support assistant
router.post("/support", aiLimiter, chatWithSupport);
export default router;
