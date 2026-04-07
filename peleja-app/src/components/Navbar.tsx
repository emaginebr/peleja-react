import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from 'nauth-react'
import { useTranslation } from 'react-i18next'
import styles from './Navbar.module.css'

export const Navbar = () => {
  const { t } = useTranslation()
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = useCallback(() => {
    logout()
    setIsOpen(false)
    navigate('/')
  }, [logout, navigate])

  const closeMenu = useCallback(() => setIsOpen(false), [])

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo} onClick={closeMenu}>
        <span className={styles.logoMark}>P</span>
        <span className={styles.logoText}>{t('brand')}</span>
      </Link>

      <button
        className={`${styles.hamburger} ${isOpen ? styles.hamburgerOpen : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menu"
        type="button"
      >
        <span className={styles.hamburgerLine} />
        <span className={styles.hamburgerLine} />
        <span className={styles.hamburgerLine} />
      </button>

      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`}
        onClick={closeMenu}
      />

      <div className={`${styles.nav} ${isOpen ? styles.navOpen : ''}`}>
        {isAuthenticated ? (
          <>
            <Link
              to="/admin/sites"
              className={styles.navLink}
              onClick={closeMenu}
            >
              {t('admin')}
            </Link>
            <button
              className={styles.logoutBtn}
              onClick={handleLogout}
              type="button"
            >
              {t('logout')}
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className={styles.navLink}
              onClick={closeMenu}
            >
              {t('login')}
            </Link>
            <Link
              to="/register"
              className={styles.ctaLink}
              onClick={closeMenu}
            >
              {t('register')}
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
