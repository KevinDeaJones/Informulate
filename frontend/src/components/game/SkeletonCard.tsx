import styles from './SkeletonCard.module.css';

export const SkeletonCard = () => (
  <div className={styles.card}>
    <div className={styles.question} />
    <div className={styles.options}>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className={styles.option}>
          <div className={styles.optionLabel} />
          <div className={styles.optionText} />
        </div>
      ))}
    </div>
  </div>
);
