import { Button } from 'components/common/Button';
import { QuestionCard } from 'components/game/QuestionCard';
import { ExplanationPanel } from 'components/game/ExplanationPanel';
import styles from './GameContent.module.css';

export const GameContent = ({
  question,
  selectedAnswer,
  loading,
  submittedResult,
  onSelect,
  onSubmit,
  onNextQuestion,
}: {
  question: any;
  selectedAnswer: number | null;
  loading: boolean;
  submittedResult: any;
  onSelect: (index: number) => void;
  onSubmit: () => void;
  onNextQuestion: () => void;
}) => (
  <>
    <QuestionCard
      question={question.question}
      options={question.options}
      selectedAnswer={selectedAnswer}
      correctAnswer={submittedResult?.correct_index}
      onSelect={onSelect}
      disabled={!!submittedResult}
    />

    {!submittedResult ? (
      <Button
        onClick={onSubmit}
        variant='primary'
        disabled={selectedAnswer === null}
        isLoading={loading}
        className={styles.submitButton}
      >
        {loading ? 'Submitting...' : 'Submit Answer'}
      </Button>
    ) : (
      <>
        <ExplanationPanel
          explanation={submittedResult.explanation}
          isCorrect={submittedResult.correct}
        />
        <Button onClick={onNextQuestion} variant='primary'>
          Next Question
        </Button>
      </>
    )}
  </>
);
