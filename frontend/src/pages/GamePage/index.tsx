import { useEffect, useState, useRef } from 'react';
import { useGame } from 'hooks/useGame';
import { Button } from 'components/common/Button';
import { Scoreboard } from 'components/layout/Scoreboard';
import { GameErrorState } from './GameErrorState';
import { GameLoadingState } from './GameLoadingState';
import { GameContent } from './GameContent';

import styles from './GamePage.module.css';

const GamePage = () => {
  const {
    score,
    currentQuestion,
    isLoadingQuestion,
    isLoadingAnswer,
    error,
    submittedResult,
    startNewGame,
    handleAnswerSubmission,
  } = useGame();

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!hasStarted.current) {
      hasStarted.current = true;
      startNewGame();
    }
  }, []);

  const handleSubmit = () =>
    selectedAnswer !== null && handleAnswerSubmission(selectedAnswer);

  return (
    <div className={styles.gameContainer}>
      <Scoreboard correct={score.correct} incorrect={score.incorrect} />

      {error ? (
        <GameErrorState
          error={error}
          loading={isLoadingQuestion}
          onRetry={startNewGame}
        />
      ) : isLoadingQuestion ? (
        <GameLoadingState isLoadingAnswer={isLoadingAnswer} />
      ) : currentQuestion ? (
        <GameContent
          question={currentQuestion}
          selectedAnswer={selectedAnswer}
          loading={isLoadingAnswer}
          submittedResult={submittedResult}
          onSelect={setSelectedAnswer}
          onSubmit={handleSubmit}
          onNextQuestion={() => {
            setSelectedAnswer(null);
            startNewGame();
          }}
        />
      ) : (
        <div className={styles.noQuestions}>
          <p>Failed to load questions. Please try again.</p>
          <Button onClick={startNewGame}>Retry</Button>
        </div>
      )}
    </div>
  );
};

export default GamePage;
