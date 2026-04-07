import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth, LoginForm } from 'nauth-react'
import { useTranslation } from 'react-i18next'
import styles from './LoginPage.module.css'

export const LoginPage = () => {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) navigate('/admin/sites', { replace: true })
  }, [isAuthenticated, navigate])

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>{t('login')}</h1>
        <LoginForm onSuccess={() => navigate('/admin/sites')} />
        <div className={styles.footer}>
          {t('noAccount')}
          <Link to="/register" className={styles.footerLink}>
            {t('registerHere')}
          </Link>
        </div>
      </div>
    </div>
  )
}
