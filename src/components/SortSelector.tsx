import { useTranslation } from 'react-i18next'
import styles from './SortSelector.module.css'

interface SortSelectorProps {
  value: 'recent' | 'popular'
  onChange: (value: 'recent' | 'popular') => void
}

export const SortSelector = ({ value, onChange }: SortSelectorProps) => {
  const { t } = useTranslation()

  return (
    <div className={styles.selector}>
      <button
        className={`${styles.option} ${value === 'recent' ? styles.active : ''}`}
        onClick={() => onChange('recent')}
        type="button"
      >
        {t('recent')}
      </button>
      <button
        className={`${styles.option} ${value === 'popular' ? styles.active : ''}`}
        onClick={() => onChange('popular')}
        type="button"
      >
        {t('popular')}
      </button>
    </div>
  )
}
