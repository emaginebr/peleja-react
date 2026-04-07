import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth, RegisterForm } from 'nauth-react'
import { useTranslation } from 'react-i18next'
import styles from './LoginPage.module.css'

export const RegisterPage = () => {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) navigate('/admin/sites', { replace: true })
  }, [isAuthenticated, navigate])

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>{t('register')}</h1>
        <RegisterForm onSuccess={() => navigate('/admin/sites')} />
        <div className={styles.footer}>
          {t('hasAccount')}
          <Link to="/login" className={styles.footerLink}>
            {t('loginHere')}
          </Link>
        </div>
      </div>
    </div>
  )
}
