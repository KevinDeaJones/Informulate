import express from 'express';
import { saveQuestion } from '../utils/storage.js';
import { v4 as uuidv4 } from 'uuid';
import executeWithRetry from '../langchain/agent.js';

const router = express.Router();

router.get('/next-question', async (req, res) => {
  try {
    const questionData = await executeWithRetry();
    // const questionData = {
    //   question: 'How long is the Great Barrier Reef?',
    //   options: [ '1,250 miles', '1,400 miles', '1,000 miles', '1,500 miles' ],
    //   answerIndex: 0
    // }

    const questionId = uuidv4();
    saveQuestion(questionId, questionData);
    console.log(questionData);

    delete questionData.answerIndex;

    res.json({
      id: questionId,
      ...questionData
    });
  } catch (error) {
    console.error('Error /next-question:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
