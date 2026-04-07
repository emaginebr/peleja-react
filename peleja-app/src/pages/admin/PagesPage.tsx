import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useNavigate } from 'react-router-dom'
import { useSites } from '../../hooks/useSites'
import type { PageInfo } from '../../Services/SiteService'
import styles from './PagesPage.module.css'

export const PagesPage = () => {
  const { t } = useTranslation()
  const { siteId } = useParams<{ siteId: string }>()
  const navigate = useNavigate()
  const { state, service } = useSites()

  const numericSiteId = Number(siteId)
  const site = state.sites.find((s) => s.siteId === numericSiteId)

  const [pages, setPages] = useState<PageInfo[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const loadPages = useCallback(
    async (cursor?: string) => {
      setIsLoading(true)
      try {
        const result = await service.getPages(numericSiteId, cursor)
        if (cursor) {
          setPages((prev) => [...prev, ...result.items])
        } else {
          setPages(result.items)
        }
        setNextCursor(result.nextCursor)
        setHasMore(result.hasMore)
      } finally {
        setIsLoading(false)
      }
    },
    [service, numericSiteId],
  )

  useEffect(() => {
    loadPages()
  }, [loadPages])

  return (
    <div className={styles.page}>
      <button
        className={styles.backBtn}
        onClick={() => navigate('/admin/sites')}
        type="button"
      >
        ← {t('sites')}
      </button>

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t('pages')}</h1>
          {site && (
            <p className={styles.siteUrl}>{site.siteUrl}</p>
          )}
        </div>
      </div>

      {isLoading && pages.length === 0 ? (
        <div className={styles.empty}>{t('loading')}</div>
      ) : pages.length === 0 ? (
        <div className={styles.empty}>{t('noPages')}</div>
      ) : (
        <div className={styles.list}>
          {pages.map((pg) => (
            <button
              key={pg.pageId}
              className={styles.pageItem}
              onClick={() =>
                navigate(
                  `/admin/sites/${numericSiteId}/pages/${pg.pageId}/comments`,
                )
              }
              type="button"
            >
              <div className={styles.pageInfo}>
                <span className={styles.pageUrl}>{pg.pageUrl}</span>
                <span className={styles.pageDate}>
                  {new Date(pg.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className={styles.pageRight}>
                <span className={styles.commentCount}>
                  {pg.commentCount}
                </span>
                <span className={styles.commentLabel}>
                  {t('comments').toLowerCase()}
                </span>
                <svg
                  className={styles.chevron}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      )}

      {hasMore && (
        <div className={styles.loadMore}>
          <button
            className={styles.loadMoreBtn}
            onClick={() => loadPages(nextCursor ?? undefined)}
            disabled={isLoading}
            type="button"
          >
            {isLoading ? t('loading') : t('loadMore')}
          </button>
        </div>
      )}
    </div>
  )
}
