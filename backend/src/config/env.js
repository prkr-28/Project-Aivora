import dotenv from "dotenv";
dotenv.config();

const parseFrontendUrls = (envValue) => {
  const defaultUrl = "http://localhost:3000";
  if (!envValue) return [defaultUrl];
  const urls = envValue.split(",").map((u) => u.trim()).filter(Boolean);
  return urls.length > 0 ? urls : [defaultUrl];
};

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET || "your-secret-key",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  openaiApiKey: process.env.OPENAI_API_KEY || "",
  groqApiKey: process.env.GROQ_API_KEY || "",
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  frontendUrls: parseFrontendUrls(process.env.FRONTEND_URL),
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"),
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
};
export default config;
