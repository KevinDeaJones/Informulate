import { Button } from 'components/common/Button';
import styles from './GameErrorState.module.css';

export const GameErrorState = ({
  error,
  loading,
  onRetry,
}: {
  error: string;
  loading: boolean;
  onRetry: () => void;
}) => (
  <div className={styles.errorContainer}>
    <div className={styles.errorMessage}>{error}</div>
    <Button onClick={onRetry} variant='primary' isLoading={loading}>
      {loading ? 'Retrying...' : 'Retry'}
    </Button>
  </div>
);
