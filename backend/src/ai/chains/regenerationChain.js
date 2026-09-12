import { createModel } from "../config/model.config.js";
import { createRegenerationPrompt } from "../prompts/regeneration.prompt.js";
import { validatePlanStructure } from "../utils/promptBuilder.js";
import { runStructuredGeneration } from "../graphs/structuredGenerationGraph.js";

/**
 * Regenerates the remaining days of a goal plan, using the same
 * LangGraph self-correction workflow as the initial planner so a malformed
 * AI response gets repaired automatically instead of failing the request.
 */
export const regeneratePlan = async (
  goalTitle,
  completedDays,
  remainingDays,
  originalPlan,
  progressData,
  userFeedback,
) => {
  const model = createModel(0.7);
  const basePrompt = createRegenerationPrompt(
    goalTitle,
    completedDays,
    remainingDays,
    originalPlan,
    progressData,
    userFeedback,
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
    throw new Error(`Failed to regenerate plan: ${error || "invalid AI response"}`);
  }

  // Ensure day numbers continue from where user left off
  const adjustedPlan = parsed.map((day, index) => ({
    ...day,
    day: completedDays + index + 1,
  }));

  return adjustedPlan;
};

export default {
  regeneratePlan,
};
