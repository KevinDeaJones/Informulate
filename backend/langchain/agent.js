import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import dotenv from 'dotenv';
import { QUESTION_GENERATE_PROMPT } from './prompts.js';
import VectorSearchTool from './tools/vector-search-tool.js';
import CheckNoResult from './tools/check-result-tool.js';
import { jsonrepair } from 'jsonrepair';
import { ChatOpenAI } from '@langchain/openai';

dotenv.config();

// Initialize the OpenAI model with specific parameters
const model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0.8,
    modelName: 'gpt-4o'
});

// Create a LangChain agent executor with custom tools
async function createAgent() {
    const tools = [
        new VectorSearchTool(), // Tool for performing vector-based searches
        new CheckNoResult()     // Tool to check if results were returned
    ];

    const executor = await initializeAgentExecutorWithOptions(
        tools,
        model,
        {
            agentType: "zero-shot-react-description",
            verbose: false,
            maxIterations: 5,
            handleParsingErrors: true
        }
    );

    return executor;
}

// Parse the JSON output from the LLM and ensure it matches the expected structure
function parseOutput(output) {
    output = output
        .replace(/```json\s*/i, '') // Remove opening markdown code block
        .replace(/```/, '')         // Remove closing markdown code block
        .trim();

    output = jsonrepair(output); // Attempt to fix malformed JSON

    const data = JSON.parse(output);

    // Validate the structure and types of the parsed data
    if (
        typeof data === 'object' &&
        typeof data.Question === 'string' &&
        Array.isArray(data.Options) &&
        data.Options.length === 4 &&
        typeof data.AnswerIndex === 'number' &&
        data.AnswerIndex >= 0 &&
        data.AnswerIndex < 4
    ) {
        return {
            question: data.Question,
            options: data.Options,
            answerIndex: data.AnswerIndex
        };
    }

    throw new Error("Invalid format or data types.");
}

// Retry logic to ensure resilience in case of temporary LLM/tool failures
async function executeWithRetry() {
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            const agent = await createAgent();
            const result = await agent.invoke({ input: QUESTION_GENERATE_PROMPT });
            return parseOutput(result.output); // Try to parse the result into the expected format
        } catch (error) {
            console.error(`Attempt ${attempt + 1} failed:`, error.message);
            attempt++;

            // Add a short delay between retries to avoid rapid failure loops
            await new Promise(resolve => setTimeout(resolve, 300));
        }
    }

    // Fallback result in case all attempts fail
    console.error('All retries failed, using fallback');
    return {
        question: "Trivia temporarily unavailable",
        options: ["-", "-", "-", "-"],
        answerIndex: 0
    };
}

export default executeWithRetry;