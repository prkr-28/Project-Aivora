import { createModel } from "../config/model.config.js";
import { createInsightsPrompt } from "../prompts/insights.prompt.js";
import { validateInsightStructure } from "../utils/promptBuilder.js";
import { runStructuredGeneration } from "../graphs/structuredGenerationGraph.js";

/**
 * Analyzes a goal's progress history and produces structured insights
 * (mood trend, motivation level, blockers, recommendations) via the
 * LangGraph self-correcting generation workflow.
 */
export const generateInsights = async (progressData) => {
  if (progressData.length === 0) {
    return {
      summary: "No progress data available yet. Start tracking your journey!",
      moodTrend: [],
      motivationLevel: 50,
      blockers: [],
      recommendations: [
        "Begin tracking your daily progress",
        "Add comments to your entries",
      ],
      highlights: [],
    };
  }

  const model = createModel(0.8);
  const basePrompt = createInsightsPrompt(progressData);

  const buildPrompt = (attempt, lastError) => {
    if (attempt === 0) return basePrompt;
    return `${basePrompt}\n\n**Repair Instructions:**\nYour previous response was invalid: ${lastError}\nReturn ONLY a valid JSON object matching the required structure, with no markdown fences, comments, or extra text.`;
  };

  try {
    const { parsed, error } = await runStructuredGeneration({
      model,
      buildPrompt,
      validate: validateInsightStructure,
      maxAttempts: 3,
    });

    if (!parsed) {
      throw new Error(error || "invalid AI response");
    }

    return parsed;
  } catch (error) {
    console.error("Error generating insights:", error);
    throw new Error(`Failed to generate insights: ${error.message}`);
  }
};

export default {
  generateInsights,
};
