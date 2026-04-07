import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useSites } from '../../hooks/useSites'
import { SiteFormModal } from './SiteFormModal'
import { SiteStatus } from '../../types/site'
import type { SiteInfo } from '../../types/site'
import styles from './SitesPage.module.css'

export const SitesPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { state, loadMoreSites } = useSites()
  const [showForm, setShowForm] = useState(false)
  const [editingSite, setEditingSite] = useState<SiteInfo | null>(null)
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const handleCopy = useCallback(
    async (site: SiteInfo) => {
      await navigator.clipboard.writeText(site.clientId)
      setCopiedId(site.siteId)
      setTimeout(() => setCopiedId(null), 2000)
    },
    [],
  )

  const handleEdit = useCallback((site: SiteInfo) => {
    setEditingSite(site)
    setShowForm(true)
  }, [])

  const handleCloseForm = useCallback(() => {
    setShowForm(false)
    setEditingSite(null)
  }, [])

  const getStatusBadge = (status: SiteStatus) => {
    switch (status) {
      case SiteStatus.Active:
        return <span className={`${styles.badge} ${styles.badgeActive}`}>{t('active')}</span>
      case SiteStatus.Inactive:
        return <span className={`${styles.badge} ${styles.badgeInactive}`}>{t('inactive')}</span>
      case SiteStatus.Blocked:
        return <span className={`${styles.badge} ${styles.badgeBlocked}`}>{t('blocked')}</span>
    }
  }

  if (state.isLoading && state.sites.length === 0) {
    return <div className={styles.page}><p>{t('loading')}</p></div>
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('sites')}</h1>
        <button
          className={styles.newBtn}
          onClick={() => setShowForm(true)}
          type="button"
        >
          + {t('newSite')}
        </button>
      </div>

      {state.sites.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>{t('noSites')}</p>
        </div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t('siteUrl')}</th>
              <th>{t('clientId')}</th>
              <th>{t('status')}</th>
              <th>{t('createdAt')}</th>
              <th>{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {state.sites.map((site) => (
              <tr key={site.siteId}>
                <td>{site.siteUrl}</td>
                <td className={styles.clientId} title={site.clientId}>
                  {site.clientId}
                </td>
                <td>{getStatusBadge(site.status)}</td>
                <td>{new Date(site.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className={styles.actionBtns}>
                    <button
                      className={styles.actionBtn}
                      onClick={() =>
                        navigate(`/admin/sites/${site.siteId}/pages`)
                      }
                      type="button"
                      title={t('comments')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                    <button
                      className={`${styles.actionBtn} ${copiedId === site.siteId ? styles.copySuccess : ''}`}
                      onClick={() => handleCopy(site)}
                      type="button"
                      title={copiedId === site.siteId ? t('copied') : t('copy')}
                    >
                      {copiedId === site.siteId ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                      )}
                    </button>
                    {site.status !== SiteStatus.Blocked && (
                      <button
                        className={styles.actionBtn}
                        onClick={() => handleEdit(site)}
                        type="button"
                        title={t('edit')}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {state.hasMore && (
        <div className={styles.loadMore}>
          <button
            className={styles.loadMoreBtn}
            onClick={loadMoreSites}
            disabled={state.isLoading}
            type="button"
          >
            {state.isLoading ? t('loading') : t('loadMore')}
          </button>
        </div>
      )}

      {showForm && (
        <SiteFormModal site={editingSite} onClose={handleCloseForm} />
      )}
    </div>
  )
}
