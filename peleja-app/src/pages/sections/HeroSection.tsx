import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import styles from './HeroSection.module.css'

export const HeroSection = () => {
  const { t } = useTranslation()

  return (
    <section className={styles.hero}>
      <span className={styles.badge}>
        <span className={styles.badgeDot} />
        Open Source
      </span>
      <h1 className={styles.title}>
        {t('heroTitle').split(' ').slice(0, -2).join(' ')}{' '}
        <span className={styles.titleAccent}>
          {t('heroTitle').split(' ').slice(-2).join(' ')}
        </span>
      </h1>
      <p className={styles.subtitle}>{t('heroSubtitle')}</p>
      <Link to="/register" className={styles.cta}>
        {t('heroCta')}
        <span className={styles.ctaArrow}>→</span>
      </Link>
    </section>
  )
}
