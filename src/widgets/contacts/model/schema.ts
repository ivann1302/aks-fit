import { z } from 'zod';

export const contactsSchema = z.object({
  name: z.string().min(2, 'Минимум 2 символа').max(50, 'Максимум 50 символов'),
  phone: z
    .string()
    .regex(
      /^(\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/,
      'Неверный формат телефона'
    ),
});

export type ContactsFormData = z.infer<typeof contactsSchema>;
