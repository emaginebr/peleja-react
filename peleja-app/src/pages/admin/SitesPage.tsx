import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSites } from '../../hooks/useSites'
import { SiteFormModal } from './SiteFormModal'
import { SiteStatus } from '../../types/site'
import type { SiteInfo } from '../../types/site'
import styles from './SitesPage.module.css'

export const SitesPage = () => {
  const { t } = useTranslation()
  const { state } = useSites()
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

  if (state.isLoading) {
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
                      className={`${styles.actionBtn} ${copiedId === site.siteId ? styles.copySuccess : ''}`}
                      onClick={() => handleCopy(site)}
                      type="button"
                    >
                      {copiedId === site.siteId ? t('copied') : t('copy')}
                    </button>
                    {site.status !== SiteStatus.Blocked && (
                      <button
                        className={styles.actionBtn}
                        onClick={() => handleEdit(site)}
                        type="button"
                      >
                        {t('edit')}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showForm && (
        <SiteFormModal site={editingSite} onClose={handleCloseForm} />
      )}
    </div>
  )
}
