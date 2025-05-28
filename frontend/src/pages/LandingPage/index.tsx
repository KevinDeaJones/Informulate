import { useNavigate } from 'react-router-dom';
import { Button } from 'components/common/Button';

import styles from './LandingPage.module.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.landingContainer}>
      <h1 className={styles.gameTitle}>AI Trivia Arena</h1>
      <Button onClick={() => navigate('/play')} variant='primary'>
        Start Game
      </Button>
    </div>
  );
};

export default LandingPage;
