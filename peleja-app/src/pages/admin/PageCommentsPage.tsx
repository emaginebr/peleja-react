import { useTranslation } from 'react-i18next'
import { useParams, useNavigate } from 'react-router-dom'
import { CommentList } from './CommentList'
import styles from './PageCommentsPage.module.css'

export const PageCommentsPage = () => {
  const { t } = useTranslation()
  const { siteId, pageId } = useParams<{ siteId: string; pageId: string }>()
  const navigate = useNavigate()

  const numericSiteId = Number(siteId)
  const numericPageId = Number(pageId)

  return (
    <div className={styles.page}>
      <button
        className={styles.backBtn}
        onClick={() => navigate(`/admin/sites/${numericSiteId}/pages`)}
        type="button"
      >
        ← {t('pages')}
      </button>

      <h1 className={styles.title}>{t('comments')}</h1>

      <CommentList siteId={numericSiteId} pageId={numericPageId} />
    </div>
  )
}
