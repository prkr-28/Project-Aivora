import { StateGraph, Annotation, END, START } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import { parseJsonResponse } from "../utils/promptBuilder.js";

/**
 * A reusable LangGraph workflow that generates structured (JSON) output from
 * a chat model and self-corrects if the model's response fails validation.
 *
 * Flow:
 *   START -> generate -> validate -> (valid or out of attempts?) -> END
 *                              \-> (invalid, attempts left) -> generate
 *
 * Each retry appends the previous validation error back into the prompt so
 * the model can repair its own output, instead of the caller having to
 * hand-roll a retry loop around a plain LangChain call.
 */
const GenerationState = Annotation.Root({
  model: Annotation({
    reducer: (_left, right) => right,
    default: () => null,
  }),
  buildPrompt: Annotation({
    reducer: (_left, right) => right,
    default: () => null,
  }),
  validateFn: Annotation({
    reducer: (_left, right) => right,
    default: () => () => true,
  }),
  maxAttempts: Annotation({
    reducer: (_left, right) => right,
    default: () => 3,
  }),
  attempts: Annotation({
    reducer: (_left, right) => right,
    default: () => 0,
  }),
  rawResponse: Annotation({
    reducer: (_left, right) => right,
    default: () => null,
  }),
  parsed: Annotation({
    reducer: (_left, right) => right,
    default: () => null,
  }),
  error: Annotation({
    reducer: (_left, right) => right,
    default: () => null,
  }),
});

async function generateNode(state) {
  const prompt = state.buildPrompt(state.attempts, state.error);
  const response = await state.model.invoke([new HumanMessage(prompt)]);
  const content =
    typeof response.content === "string"
      ? response.content
      : JSON.stringify(response.content);

  return {
    rawResponse: content,
    attempts: state.attempts + 1,
  };
}

async function validateNode(state) {
  try {
    const parsed = parseJsonResponse(state.rawResponse);
    if (!state.validateFn(parsed)) {
      return {
        parsed: null,
        error:
          "The response did not match the required structure. Double-check every field name and type.",
      };
    }
    return { parsed, error: null };
  } catch (err) {
    return { parsed: null, error: err.message };
  }
}

function routeAfterValidate(state) {
  if (state.parsed && !state.error) return END;
  if (state.attempts >= state.maxAttempts) return END;
  return "generate";
}

const graph = new StateGraph(GenerationState)
  .addNode("generate", generateNode)
  .addNode("validate", validateNode)
  .addEdge(START, "generate")
  .addEdge("generate", "validate")
  .addConditionalEdges("validate", routeAfterValidate)
  .compile();

/**
 * Run the self-correcting structured generation graph.
 *
 * @param {object} options
 * @param {object} options.model - a LangChain chat model instance
 * @param {(attempt: number, lastError: string | null) => string} options.buildPrompt
 *   builds the prompt for a given attempt number (0-indexed). Receives the
 *   previous validation error (if any) so it can ask the model to repair
 *   its output.
 * @param {(parsed: any) => boolean} options.validate - structural validator
 * @param {number} [options.maxAttempts=3]
 * @returns {Promise<{ parsed: any, error: string | null, attempts: number }>}
 */
export const runStructuredGeneration = async ({
  model,
  buildPrompt,
  validate,
  maxAttempts = 3,
}) => {
  const result = await graph.invoke({
    model,
    buildPrompt,
    validateFn: validate,
    maxAttempts,
  });

  return {
    parsed: result.parsed,
    error: result.error,
    attempts: result.attempts,
  };
};

export default { runStructuredGeneration };
