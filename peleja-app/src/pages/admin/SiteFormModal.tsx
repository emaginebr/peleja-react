import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSites } from '../../hooks/useSites'
import type { SiteInfo } from '../../types/site'
import { SiteStatus } from '../../types/site'
import styles from './SiteFormModal.module.css'

interface SiteFormModalProps {
  site?: SiteInfo | null
  onClose: () => void
}

export const SiteFormModal = ({ site, onClose }: SiteFormModalProps) => {
  const { t } = useTranslation()
  const { createSite, updateSite } = useSites()
  const tenantId = import.meta.env.VITE_TENANT_ID || 'emagine'

  const isEditing = !!site
  const [siteUrl, setSiteUrl] = useState(site?.siteUrl || '')
  const [tenant, setTenant] = useState(site?.tenant || tenantId)
  const [status, setStatus] = useState<number>(
    site?.status ?? SiteStatus.Active,
  )
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = useCallback(async () => {
    if (!siteUrl.trim()) return
    setIsSaving(true)
    setError(null)
    try {
      if (isEditing && site) {
        await updateSite(site.siteId, { siteUrl: siteUrl.trim(), status })
      } else {
        await createSite({ siteUrl: siteUrl.trim(), tenant })
      }
      onClose()
    } catch (err: unknown) {
      const apiError = err as { status?: number }
      if (apiError.status === 409) {
        setError(t('urlAlreadyExists'))
      } else {
        setError(t('error'))
      }
    } finally {
      setIsSaving(false)
    }
  }, [siteUrl, tenant, status, isEditing, site, createSite, updateSite, onClose, t])

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>
          {isEditing ? t('editSite') : t('newSite')}
        </h2>

        <div className={styles.field}>
          <label className={styles.label}>{t('siteUrl')}</label>
          <input
            className={styles.input}
            type="url"
            value={siteUrl}
            onChange={(e) => setSiteUrl(e.target.value)}
            placeholder="https://example.com"
            autoFocus
          />
        </div>

        {!isEditing && (
          <div className={styles.field}>
            <label className={styles.label}>{t('tenant')}</label>
            <select
              className={styles.select}
              value={tenant}
              onChange={(e) => setTenant(e.target.value)}
            >
              <option value={tenantId}>{tenantId}</option>
            </select>
          </div>
        )}

        {isEditing && site?.status !== SiteStatus.Blocked && (
          <div className={styles.field}>
            <label className={styles.label}>{t('status')}</label>
            <select
              className={styles.select}
              value={status}
              onChange={(e) => setStatus(Number(e.target.value))}
            >
              <option value={SiteStatus.Active}>{t('active')}</option>
              <option value={SiteStatus.Inactive}>{t('inactive')}</option>
            </select>
          </div>
        )}

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.actions}>
          <button
            className={`${styles.btn} ${styles.cancelBtn}`}
            onClick={onClose}
            type="button"
          >
            {t('cancel')}
          </button>
          <button
            className={`${styles.btn} ${styles.saveBtn}`}
            onClick={handleSubmit}
            disabled={!siteUrl.trim() || isSaving}
            type="button"
          >
            {isSaving ? t('loading') : t('save')}
          </button>
        </div>
      </div>
    </div>
  )
}
