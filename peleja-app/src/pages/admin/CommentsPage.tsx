import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSites } from '../../hooks/useSites'
import { CommentList } from './CommentList'
import styles from './CommentsPage.module.css'

export const CommentsPage = () => {
  const { t } = useTranslation()
  const { state } = useSites()
  const [selectedClientId, setSelectedClientId] = useState('')
  const [pageUrl, setPageUrl] = useState('')
  const [activeSearch, setActiveSearch] = useState<{
    clientId: string
    pageUrl: string
  } | null>(null)

  const handleSearch = useCallback(() => {
    if (selectedClientId && pageUrl.trim()) {
      setActiveSearch({
        clientId: selectedClientId,
        pageUrl: pageUrl.trim(),
      })
    }
  }, [selectedClientId, pageUrl])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleSearch()
    },
    [handleSearch],
  )

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
          value={selectedClientId}
          onChange={(e) => {
            setSelectedClientId(e.target.value)
            setActiveSearch(null)
          }}
        >
          <option value="">{t('selectSite')}</option>
          {state.sites.map((site) => (
            <option key={site.siteId} value={site.clientId}>
              {site.siteUrl}
            </option>
          ))}
        </select>

        <input
          className={styles.input}
          type="url"
          placeholder={t('searchUrl')}
          value={pageUrl}
          onChange={(e) => setPageUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!selectedClientId}
        />

        <button
          className={styles.searchBtn}
          onClick={handleSearch}
          disabled={!selectedClientId || !pageUrl.trim()}
          type="button"
        >
          {t('search')}
        </button>
      </div>

      {activeSearch && (
        <CommentList
          clientId={activeSearch.clientId}
          pageUrl={activeSearch.pageUrl}
        />
      )}
    </div>
  )
}
