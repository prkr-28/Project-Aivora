import { z } from "zod";
import { createFastModel } from "../config/model.config.js";
import { analyzeSentiment as librarySentiment } from "./sentimentAnalyzer.js";

// The exact shape we want back from the AI
const SentimentSchema = z.object({
    score: z
        .number()
        .min(-1)
        .max(1)
        .describe("-1 = very negative, 0 = neutral, 1 = very positive"),
    emotion: z.enum([
        "motivated",
        "happy",
        "neutral",
        "tired",
        "stressed",
        "frustrated",
    ]),
    reason: z.string().describe("One short sentence explaining the score"),
});

export const analyzeSentimentLLM = async (text) => {
    if (!text || text.trim().length === 0) {
        return { score: 0, emotion: "neutral", reason: "No comment" };
    }

    try {
        const model = createFastModel(0).withStructuredOutput(SentimentSchema);

        return await model.invoke(
            `Analyze the sentiment of this daily progress comment from a user
working on a personal goal. Understand sarcasm and context.

Comment: """${text}"""`,
        );
    } catch (error) {
        // If the AI call fails, fall back to the word-list library
        const result = librarySentiment(text);
        return { score: result.score, emotion: "neutral", reason: "fallback" };
    }
};