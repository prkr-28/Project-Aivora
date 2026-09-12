import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import config from "../../config/env.js";
export const createModel = (temperature = 0.7) => {
  return new ChatGoogleGenerativeAI({
    apiKey: config.geminiApiKey,
    model: "gemini-2.5-flash",
    temperature,
  });
};
export const createFastModel = (temperature = 0.3) => {
  return new ChatGoogleGenerativeAI({
    apiKey: config.geminiApiKey,
    model: "gemini-2.5-flash",
    temperature,
  });
};
export default {
  createModel,
  createFastModel,
};
