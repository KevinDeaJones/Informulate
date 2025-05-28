import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import nextQuestionRouter from './api/next-question.js';
//import submitAnswerRouter from './api/submit-answer.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', nextQuestionRouter);
//app.use('/api', submitAnswerRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
