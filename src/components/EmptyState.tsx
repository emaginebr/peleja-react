import { useTranslation } from 'react-i18next'
import styles from './EmptyState.module.css'

export const EmptyState = () => {
  const { t } = useTranslation()

  return (
    <div className={styles.empty}>
      <p className={styles.title}>{t('noComments')}</p>
      <p className={styles.subtitle}>{t('beFirst')}</p>
    </div>
  )
}
