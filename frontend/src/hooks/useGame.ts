import { useState } from 'react';
import { fetchQuestion, submitAnswer } from '../services/api';
import { AnswerResponse, Question } from '../types/types';

export const useGame = () => {
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedResult, setSubmittedResult] = useState<AnswerResponse | null>(
    null
  );

  const handleAnswerSubmission = async (selectedIndex: number) => {
    if (!currentQuestion) return null;

    try {
      setIsLoadingAnswer(true);
      const result = await submitAnswer(currentQuestion.id, selectedIndex);

      setSubmittedResult(result);
      setScore((prev) => ({
        correct: prev.correct + (result.correct ? 1 : 0),
        incorrect: prev.incorrect + (!result.correct ? 1 : 0),
      }));

      setError(null);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Answer submission failed');
      return null;
    } finally {
      setIsLoadingAnswer(false);
    }
  };

  return {
    score,
    currentQuestion,
    isLoadingQuestion,
    isLoadingAnswer,
    error,
    submittedResult,
    startNewGame: async () => {
      setIsLoadingQuestion(true);
      try {
        const question = await fetchQuestion();

        setCurrentQuestion(question);
        setSubmittedResult(null);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to start game');
        setCurrentQuestion(null);
      } finally {
        setIsLoadingQuestion(false);
      }
    },
    handleAnswerSubmission,
  };
};
