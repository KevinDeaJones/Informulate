import styles from './Scoreboard.module.css';

type ScoreboardProps = {
  correct: number;
  incorrect: number;
};

export const Scoreboard = ({ correct, incorrect }: ScoreboardProps) => (
  <header className={styles.scoreboard}>
    <div className={styles.score}>
      <span className={styles.label}>Correct:</span>
      <span className={styles.value}>{correct}</span>
    </div>
    <div className={styles.score}>
      <span className={styles.label}>Incorrect:</span>
      <span className={styles.value}>{incorrect}</span>
    </div>
  </header>
);
