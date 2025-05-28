import express from 'express';
import { getQuestion, removeQuestion } from '../utils/storage.js';
import { EXPLANATION_PROMPT } from '../langchain/prompts.js';
import { ChatOpenAI } from '@langchain/openai';

const router = express.Router();

const model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0.3,
    modelName: 'gpt-4o'
});

router.post('/submit-answer', async (req, res) => {
    try {
        const { id, selectedIndex } = req.body;

        const questionData = getQuestion(id);

        if (!questionData)
            res.json({ correct: false, explanation: "Cannot find the requested question data." });
        else {
            const prompt = EXPLANATION_PROMPT.replace('{QuestionData}', JSON.stringify(questionData));
            const explanation = await model.invoke(prompt);

            removeQuestion(id);
            res.json({
                correct: questionData.answerIndex === selectedIndex,
                explanation: explanation.content
            });
        }
    } catch (error) {
        console.error('Error /next-question:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
