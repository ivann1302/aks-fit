import { Button } from '@/shared/ui/Button/Button';
import styles from './ContactsSection.module.scss';

export function ContactsSection() {
  return (
    <section className={styles.contacts}>
      <div className={styles.inner}>
        <h2>Готовы изменить свою жизнь?</h2>
        <form className={styles.form}>
          <input className={styles.input} type="text" placeholder="Ваше имя" name="name" />
          <input className={styles.input} type="tel" placeholder="Ваш телефон" name="phone" />
          <Button type="submit">Заказать консультацию</Button>
        </form>
      </div>
    </section>
  );
}
