import { HumanMessage } from "@langchain/core/messages";
import { createFastModel } from "../config/model.config.js";
import { createReportPrompt } from "../prompts/report.prompt.js";
export const generateReportSummary = async (data) => {
  try {
    const model = createFastModel(0.7);
    const prompt = createReportPrompt(data);
    const response = await model.invoke([new HumanMessage(prompt)]);
    const content =
      typeof response.content === "string"
        ? response.content
        : JSON.stringify(response.content);
    return content.trim();
  } catch (error) {
    console.error("Error generating report summary:", error);
    throw new Error(`Failed to generate report summary: ${error.message}`);
  }
};
export default {
  generateReportSummary,
};
