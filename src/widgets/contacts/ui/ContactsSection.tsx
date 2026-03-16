'use client';

import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { Button } from '@/shared/ui';
import { contactsSchema, type ContactsFormData } from '../model';
import styles from './ContactsSection.module.scss';

export function ContactsSection() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm<ContactsFormData>({ resolver: standardSchemaResolver(contactsSchema) });

  const onSubmit = (_data: ContactsFormData) => {
    // TODO: отправить данные на сервер
    reset();
  };

  return (
    <section id="contacts" className={styles.contacts}>
      <div className={styles.inner}>
        <h2>Готовы изменить свою жизнь?</h2>

        {isSubmitSuccessful ? (
          <p className={styles.success}>Заявка отправлена! Мы свяжемся с вами.</p>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.fieldWrap}>
              <input
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                type="text"
                placeholder="Ваше имя"
                {...register('name')}
              />
              {errors.name && <span className={styles.error}>{errors.name.message}</span>}
            </div>

            <div className={styles.fieldWrap}>
              <input
                className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                type="tel"
                placeholder="+7 (999) 000-00-00"
                {...register('phone')}
              />
              {errors.phone && <span className={styles.error}>{errors.phone.message}</span>}
            </div>

            <Button animated type="submit">
              Заказать консультацию
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
