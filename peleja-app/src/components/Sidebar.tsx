import { useState, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import styles from './Sidebar.module.css'

export const Sidebar = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const closeSidebar = useCallback(() => setIsOpen(false), [])

  const isActive = (path: string) =>
    location.pathname === path ? styles.active : ''

  return (
    <>
      <button
        className={styles.mobileToggle}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        aria-label="Menu"
      >
        ☰
      </button>

      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`}
        onClick={closeSidebar}
      />

      <aside
        className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}
      >
        <div className={styles.brand}>
          <Link to="/" className={styles.brandLink} onClick={closeSidebar}>
            <span className={styles.brandMark}>P</span>
            <span className={styles.brandText}>{t('brand')}</span>
          </Link>
        </div>

        <nav className={styles.nav}>
          <Link
            to="/admin/sites"
            className={`${styles.navLink} ${isActive('/admin/sites')}`}
            onClick={closeSidebar}
          >
            <span className={styles.icon}>🌐</span>
            {t('sites')}
          </Link>
          <Link
            to="/admin/comments"
            className={`${styles.navLink} ${isActive('/admin/comments')}`}
            onClick={closeSidebar}
          >
            <span className={styles.icon}>💬</span>
            {t('comments')}
          </Link>
        </nav>
      </aside>
    </>
  )
}
