import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { useSites } from '../../hooks/useSites'
import type { PageInfo } from '../../Services/SiteService'
import { CommentList } from './CommentList'
import styles from './CommentsPage.module.css'

export const CommentsPage = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const { state, service } = useSites()
  const routerState = location.state as { siteId?: number } | null
  const [selectedSiteId, setSelectedSiteId] = useState<number | null>(
    routerState?.siteId ?? null,
  )
  const [pages, setPages] = useState<PageInfo[]>([])
  const [pagesLoading, setPagesLoading] = useState(false)
  const [selectedPageId, setSelectedPageId] = useState<number | null>(null)
  const [selectedPageUrl, setSelectedPageUrl] = useState<string | null>(null)

  const loadPages = useCallback(
    async (siteId: number) => {
      setPagesLoading(true)
      try {
        const result = await service.getPages(siteId)
        setPages(result.items)
      } finally {
        setPagesLoading(false)
      }
    },
    [service],
  )

  useEffect(() => {
    if (selectedSiteId) {
      setSelectedPageId(null)
      setSelectedPageUrl(null)
      loadPages(selectedSiteId)
    } else {
      setPages([])
    }
  }, [selectedSiteId, loadPages])

  const handleSelectPage = useCallback((page: PageInfo) => {
    setSelectedPageId(page.pageId)
    setSelectedPageUrl(page.pageUrl)
  }, [])

  if (state.sites.length === 0 && !state.isLoading) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>{t('comments')}</h1>
        <div className={styles.empty}>{t('noSites')}</div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{t('comments')}</h1>

      <div className={styles.filters}>
        <select
          className={styles.select}
          value={selectedSiteId ?? ''}
          onChange={(e) => {
            const val = e.target.value
            setSelectedSiteId(val ? Number(val) : null)
          }}
        >
          <option value="">{t('selectSite')}</option>
          {state.sites.map((site) => (
            <option key={site.siteId} value={site.siteId}>
              {site.siteUrl}
            </option>
          ))}
        </select>
      </div>

      {selectedSiteId && !selectedPageId && (
        <div className={styles.pageList}>
          {pagesLoading && <p>{t('loading')}</p>}
          {!pagesLoading && pages.length === 0 && (
            <div className={styles.empty}>{t('noComments')}</div>
          )}
          {pages.map((page) => (
            <button
              key={page.pageId}
              className={styles.pageItem}
              onClick={() => handleSelectPage(page)}
              type="button"
            >
              <span className={styles.pageUrl}>{page.pageUrl}</span>
              <span className={styles.pageCount}>
                {page.commentCount} {t('comments').toLowerCase()}
              </span>
            </button>
          ))}
        </div>
      )}

      {selectedSiteId && selectedPageId && selectedPageUrl && (
        <>
          <button
            className={styles.backBtn}
            onClick={() => {
              setSelectedPageId(null)
              setSelectedPageUrl(null)
            }}
            type="button"
          >
            ← {selectedPageUrl}
          </button>
          <CommentList siteId={selectedSiteId} pageId={selectedPageId} />
        </>
      )}
    </div>
  )
}
