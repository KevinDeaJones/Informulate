import styles from './ExplanationPanel.module.css';

type ExplanationPanelProps = {
  explanation: string;
  isCorrect: boolean;
};

export const ExplanationPanel = ({
  explanation,
  isCorrect,
}: ExplanationPanelProps) => (
  <div
    className={`${styles.panel} ${isCorrect ? styles.correct : styles.incorrect}`}
  >
    <div className={styles.header}>
      {isCorrect ? '✅ Correct!' : '❌ Incorrect!'}
    </div>
    <p className={styles.text}>{explanation}</p>
  </div>
);
