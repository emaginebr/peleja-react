import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { LoginForm, RegisterForm } from 'nauth-react'
import 'nauth-react/styles'
import styles from './CommentForm.module.css'

interface AuthModalProps {
  onSuccess: () => void
  onClose: () => void
}

export const AuthModal = ({ onSuccess, onClose }: AuthModalProps) => {
  const { t } = useTranslation()
  const [mode, setMode] = useState<'login' | 'register'>('login')

  const switchToRegister = useCallback(() => setMode('register'), [])
  const switchToLogin = useCallback(() => setMode('login'), [])

  return (
    <div className={styles.loginOverlay} onClick={onClose}>
      <div
        className={styles.loginModal}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeBtn} onClick={onClose} type="button">
          ×
        </button>
        {mode === 'login' ? (
          <>
            <LoginForm onSuccess={onSuccess} />
            <div className={styles.authSwitch}>
              {t('noAccount')}{' '}
              <button
                className={styles.authSwitchLink}
                onClick={switchToRegister}
                type="button"
              >
                {t('registerHere')}
              </button>
            </div>
          </>
        ) : (
          <>
            <RegisterForm onSuccess={onSuccess} />
            <div className={styles.authSwitch}>
              {t('alreadyHaveAccount')}{' '}
              <button
                className={styles.authSwitchLink}
                onClick={switchToLogin}
                type="button"
              >
                {t('loginHere')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
