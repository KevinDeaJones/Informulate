import { ReactNode } from 'react';
import styles from './Button.module.css';

type ButtonProps = {
  children: ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
};

export const Button = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  isLoading = false,
  className = '',
}: ButtonProps) => (
  <button
    className={`${styles.button} ${styles[variant]} ${className}`}
    onClick={onClick}
    disabled={disabled || isLoading}
    aria-busy={isLoading}
  >
    {isLoading ? (
      <div className={styles.loadingContent}>
        <div className={styles.spinner} aria-hidden='true' />
        <span>{children}</span>
      </div>
    ) : (
      children
    )}
  </button>
);
