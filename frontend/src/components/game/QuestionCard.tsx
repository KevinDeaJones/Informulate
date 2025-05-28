import styles from './QuestionCard.module.css';

type QuestionCardProps = {
  question: string;
  options: string[];
  selectedAnswer: number | null;
  correctAnswer?: number | null;
  onSelect: (index: number) => void;
  disabled?: boolean;
};

export const QuestionCard = ({
  question,
  options,
  selectedAnswer,
  correctAnswer,
  onSelect,
  disabled,
}: QuestionCardProps) => {
  const getAnswerState = (index: number) => {
    if (correctAnswer === undefined) return '';

    const isCorrect = index === correctAnswer;
    const isSelectedWrong = selectedAnswer === index && !isCorrect;

    if (isCorrect) return 'correct';
    if (isSelectedWrong) return 'incorrect';
    return '';
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.question}>{question}</h2>
      <div className={styles.options}>
        {options.map((option, index) => (
          <button
            key={index}
            className={`${styles.option} 
                  ${selectedAnswer === index ? styles.selected : ''}
                  ${correctAnswer !== undefined ? styles[getAnswerState(index)] : ''}`}
            onClick={() => onSelect(index)}
            disabled={disabled}
          >
            <span className={styles.optionLabel}>
              {String.fromCharCode(65 + index)}
            </span>
            {option}
            {correctAnswer === index && (
              <span className={styles.correctBadge}>✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
