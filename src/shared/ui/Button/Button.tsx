import { ButtonHTMLAttributes, useEffect, useRef, useState } from 'react';
import styles from './Button.module.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  animated?: boolean;
};

export function Button({ children, className, animated, ...rest }: ButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(!animated);

  useEffect(() => {
    if (!animated) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [animated]);

  const cls = [styles.button, animated && styles.animated, visible && styles.visible, className]
    .filter(Boolean)
    .join(' ');

  return (
    <button ref={ref} className={cls} {...rest}>
      {children}
    </button>
  );
}
