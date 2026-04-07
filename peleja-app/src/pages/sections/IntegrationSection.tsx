import { useTranslation } from 'react-i18next'
import styles from './IntegrationSection.module.css'

export const IntegrationSection = () => {
  const { t } = useTranslation()

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>{t('integrationTitle')}</h2>
        <p className={styles.desc}>{t('integrationDesc')}</p>
        <div className={styles.codeBlock}>
          <div className={styles.codeHeader}>
            <span className={`${styles.codeDot} ${styles.codeDotRed}`} />
            <span className={`${styles.codeDot} ${styles.codeDotYellow}`} />
            <span className={`${styles.codeDot} ${styles.codeDotGreen}`} />
          </div>
          <pre className={styles.code}>
            <span className={styles.comment}>{'// Install\n'}</span>
            <span className={styles.string}>{'npm install peleja-react\n\n'}</span>
            <span className={styles.comment}>{'// Use\n'}</span>
            <span className={styles.keyword}>{'import'}</span>
            <span className={styles.punctuation}>{' { '}</span>
            <span className={styles.component}>{'PelejaComments'}</span>
            <span className={styles.punctuation}>{' } '}</span>
            <span className={styles.keyword}>{'from'}</span>
            <span className={styles.string}>{" 'peleja-react'\n"}</span>
            <span className={styles.keyword}>{'import'}</span>
            <span className={styles.string}>{" 'peleja-react/style.css'\n\n"}</span>
            <span className={styles.punctuation}>{'<'}</span>
            <span className={styles.component}>{'PelejaComments'}</span>
            {'\n'}
            <span>{'  '}</span>
            <span className={styles.attr}>{'clientId'}</span>
            <span className={styles.punctuation}>{'='}</span>
            <span className={styles.string}>{'"your-client-id"'}</span>
            {'\n'}
            <span>{'  '}</span>
            <span className={styles.attr}>{'pageUrl'}</span>
            <span className={styles.punctuation}>{'='}</span>
            <span className={styles.punctuation}>{'{'}</span>
            <span>{'window.location.href'}</span>
            <span className={styles.punctuation}>{'}'}</span>
            {'\n'}
            <span>{'  '}</span>
            <span className={styles.attr}>{'apiUrl'}</span>
            <span className={styles.punctuation}>{'='}</span>
            <span className={styles.string}>{'"https://api.peleja.com"'}</span>
            {'\n'}
            <span className={styles.punctuation}>{'/>'}</span>
          </pre>
        </div>
      </div>
    </section>
  )
}
