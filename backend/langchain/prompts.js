export const QUESTION_GENERATE_PROMPT = `
Follow these steps carefully:
1. Generate a simple random topic on your own without using any tools
2. Use the VectorSearch tool EXACTLY ONCE with this topic to find most relevant facts
3. Use CheckNoResult tool with the retrieved relavant facts from VectorSearch tool to check if it is empty
4. And if it is true, you must NOT invent or make up any fact sentences. Instead, go back to Step 1, generate a new topic, and retry. Repeat this loop until VectorSearch returns results.
5. Once you have fact sentences, generate a question, four answer options, and the correct answer index based on those facts. Randomly shuffle answer options after determining the correct one. You must do Step 5 entirely on your own without using any tools.
6. Only return the result as raw JSON.

Output Format: {
  "Question": "What is the color of an apple?",
  "Options": ["Red", "Blue", "Black", "White"],
  "AnswerIndex": 0
}
`
export const EXPLANATION_PROMPT = `
Given the following multiple-choice question, correct answer, and options, write a short and clear explanation suitable for a trivia game. The explanation should confirm the correct answer and provide a relevant fact or context.
{QuestionData}
Return only Raw Explanation.
`