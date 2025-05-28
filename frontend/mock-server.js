// mock-server.js
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

// Mock database
let questions = [
  {
    id: uuidv4(),
    question: 'What is the primary ingredient in traditional Italian pesto?',
    options: ['Pine Nuts', 'Basil', 'Olive Oil', 'Parmesan Cheese'],
    correct_index: 1,
    explanation:
      'Basil is the primary ingredient giving pesto its distinctive flavor and color.',
  },
  {
    id: uuidv4(),
    question: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correct_index: 1,
    explanation: 'Mars appears reddish due to iron oxide on its surface.',
  },
];

// GET /api/next-question
app.get('/api/next-question', (req, res) => {
  // Simulate delay
  setTimeout(() => {
    const randomIndex = Math.floor(Math.random() * questions.length);
    const { id, question, options } = questions[randomIndex];

    res.json({
      id,
      question,
      options,
    });
  }, 500);
});

// POST /api/submit-answer
app.post('/api/submit-answer', (req, res) => {
  const { id, selectedIndex } = req.body;

  // Simulate delay
  setTimeout(() => {
    const question = questions.find((q) => q.id === id);

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.json({
      correct: selectedIndex === question.correct_index,
      explanation: question.explanation,
      correct_index: question.correct_index,
    });
  }, 500);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Mock server running on port ${PORT}`);
});
