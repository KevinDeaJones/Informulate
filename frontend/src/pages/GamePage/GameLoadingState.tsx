import { Loader } from 'components/common/Loader';
import { SkeletonCard } from 'components/game/SkeletonCard';
import styles from './GameLoadingState.module.css';

export const GameLoadingState = ({
  isLoadingAnswer,
}: {
  isLoadingAnswer: boolean;
}) => (
  <div className={styles.loadingContainer}>
    {isLoadingAnswer ? <Loader /> : <SkeletonCard />}
  </div>
);
