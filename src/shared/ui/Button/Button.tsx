import { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ children, className, ...rest }: ButtonProps) {
  const cls = [styles.button, className].filter(Boolean).join(' ');
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
