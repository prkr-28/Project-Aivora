import { createModel } from "../config/model.config.js";
import { createGoalPlannerPrompt } from "../prompts/goalPlanner.prompt.js";
import { validatePlanStructure } from "../utils/promptBuilder.js";
import { runStructuredGeneration } from "../graphs/structuredGenerationGraph.js";

/**
 * Generates a daily goal roadmap using a LangGraph workflow: the model
 * proposes a plan, LangGraph validates its JSON structure, and — if the
 * model returned something malformed — automatically asks it to repair the
 * response (up to 3 attempts) before giving up.
 */
export const generateGoalPlan = async (
  goalTitle,
  duration,
  hoursPerDay,
  additionalContext,
) => {
  const model = createModel(0.7);
  const basePrompt = createGoalPlannerPrompt(
    goalTitle,
    duration,
    hoursPerDay,
    additionalContext,
  );

  const buildPrompt = (attempt, lastError) => {
    if (attempt === 0) return basePrompt;
    return `${basePrompt}\n\n**Repair Instructions:**\nYour previous response was invalid: ${lastError}\nReturn ONLY a valid JSON array matching the required structure, with no markdown fences, comments, or extra text.`;
  };

  const { parsed, error } = await runStructuredGeneration({
    model,
    buildPrompt,
    validate: validatePlanStructure,
    maxAttempts: 3,
  });

  if (!parsed) {
    throw new Error(
      `Failed to generate goal plan: ${error || "invalid AI response"}`,
    );
  }

  return parsed;
};

export default {
  generateGoalPlan,
};
