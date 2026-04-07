import { useTranslation } from 'react-i18next'
import { PelejaComments } from 'peleja-react'
import styles from './DemoSection.module.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const DEMO_CLIENT_ID =
  import.meta.env.VITE_DEMO_CLIENT_ID || 'demo-client-id'

export const DemoSection = () => {
  const { t } = useTranslation()

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>{t('demoTitle')}</h2>
        <p className={styles.desc}>{t('demoDesc')}</p>
        <div className={styles.widgetContainer}>
          <PelejaComments
            clientId={DEMO_CLIENT_ID}
            pageUrl="https://peleja.com/demo"
            apiUrl={API_URL}
          />
        </div>
      </div>
    </section>
  )
}
