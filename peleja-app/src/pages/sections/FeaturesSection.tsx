import { useTranslation } from 'react-i18next'
import styles from './FeaturesSection.module.css'

const FEATURES = [
  { key: 'Emojis', icon: '😊' },
  { key: 'Gifs', icon: '🎬' },
  { key: 'Scroll', icon: '∞' },
  { key: 'Auth', icon: '🔐' },
  { key: 'Replies', icon: '💬' },
  { key: 'Likes', icon: '♥' },
  { key: 'I18n', icon: '🌍' },
  { key: 'Responsive', icon: '📱' },
] as const

export const FeaturesSection = () => {
  const { t } = useTranslation()

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{t('featuresTitle')}</h2>
      <div className={styles.grid}>
        {FEATURES.map(({ key, icon }) => (
          <div key={key} className={styles.card}>
            <span className={styles.icon}>{icon}</span>
            <h3 className={styles.cardTitle}>{t(`feature${key}`)}</h3>
            <p className={styles.cardDesc}>{t(`feature${key}Desc`)}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
