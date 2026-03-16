import styles from './ArticleBody.module.scss';

const TAGS = ['Питание', 'Тренировки', 'Восстановление'];

export function ArticleBody() {
  return (
    <div className={styles.wrap}>
      <div className={styles.imageWrap}>
        <div className={styles.image} />
      </div>

      <div className={styles.contentOuter}>
        <div className={styles.content}>
          <p className={styles.intro}>
            Многие начинающие спортсмены сосредотачиваются исключительно на тренировках, забывая,
            что результат на 70% зависит от питания. Питание — это топливо, строительный материал и
            инструмент восстановления одновременно.
          </p>

          <h2 className={styles.heading}>Белки: строительный материал для мышц</h2>
          <p className={styles.paragraph}>
            Белок — основной строительный материал мышечной ткани. После тренировки мышечные волокна
            получают микроповреждения, и именно белок помогает их восстановить и сделать сильнее.
            Оптимальная норма — 1.6–2.2 г белка на кг веса в день. Для человека весом 75 кг это
            около 120–165 г белка.
          </p>

          <blockquote className={styles.quote}>
            <span className={styles.quoteIcon} aria-hidden="true">
              ❝
            </span>
            <p>
              Питание — это не диета и не ограничения. Это инструмент, который помогает вашему телу
              стать сильнее с каждой тренировкой.
            </p>
          </blockquote>

          <h2 className={styles.heading}>Углеводы: топливо для высокой интенсивности</h2>
          <p className={styles.paragraph}>
            Углеводы — главный источник энергии во время тренировок. Резко снижая их, вы рискуете
            снизить и качество занятий. Выбирайте сложные углеводы: овсянка, гречка, бурый рис,
            батат — они дают стабильную энергию без резких скачков сахара.
          </p>

          <div className={styles.tip}>
            <span className={styles.tipLabel}>СОВЕТ ТРЕНЕРА</span>
            <p className={styles.tipText}>
              За 1.5–2 часа до тренировки ешьте углеводы со средним гликемическим индексом. После
              тренировки — быстрые углеводы вместе с белком для запуска восстановления.
            </p>
          </div>

          <h2 className={styles.heading}>Жиры и гормональный фон</h2>
          <p className={styles.paragraph}>
            Полезные жиры участвуют в синтезе гормонов, в том числе тестостерона — ключевого для
            мышечного роста. Добавьте в рацион авокадо, рыбу, орехи и оливковое масло. Главное — не
            исключать жиры полностью, а выбирать правильные источники.
          </p>

          <hr className={styles.divider} />

          <div className={styles.tags}>
            <span className={styles.tagsLabel}>Теги:</span>
            {TAGS.map(tag => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
