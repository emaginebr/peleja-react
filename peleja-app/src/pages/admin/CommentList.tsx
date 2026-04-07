import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSites } from '../../hooks/useSites'
import styles from './CommentList.module.css'

interface CommentResult {
  commentId: number
  content: string
  gifUrl: string | null
  isEdited: boolean
  isDeleted: boolean
  likeCount: number
  createdAt: string
  userId: number
  userName?: string | null
  userImageUrl?: string | null
}

interface PaginatedComments {
  items: CommentResult[]
  nextCursor: string | null
  hasMore: boolean
}

interface CommentListProps {
  siteId: number
  pageId: number
}

export const CommentList = ({ siteId, pageId }: CommentListProps) => {
  const { t } = useTranslation()
  const { service } = useSites()
  const [comments, setComments] = useState<CommentResult[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchComments = useCallback(
    async (cursor?: string | null) => {
      setIsLoading(true)
      try {
        const result = await service.getPageComments(
          siteId,
          pageId,
          cursor ?? undefined,
        ) as PaginatedComments
        if (cursor) {
          setComments((prev) => [...prev, ...result.items])
        } else {
          setComments(result.items)
        }
        setNextCursor(result.nextCursor)
        setHasMore(result.hasMore)
      } finally {
        setIsLoading(false)
      }
    },
    [service, siteId, pageId],
  )

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  const handleDelete = useCallback(async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      // DELETE uses the public comment endpoint with X-Client-Id
      // But since we're in the admin context with X-Tenant-Id,
      // we use the service's http client which has the tenant header
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const tenantId = import.meta.env.VITE_TENANT_ID || 'emagine'
      const token = document.cookie // nauth stores in localStorage
      const storedAuth = localStorage.getItem('login-with-metamask:auth')
      const authToken = storedAuth ? JSON.parse(storedAuth)?.token : null

      await fetch(`${apiUrl}/api/v1/comments/${deleteId}`, {
        method: 'DELETE',
        headers: {
          'X-Tenant-Id': tenantId,
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
      })
      setComments((prev) =>
        prev.map((c) =>
          c.commentId === deleteId
            ? { ...c, content: '[Comment removed]', isDeleted: true }
            : c,
        ),
      )
      setDeleteId(null)
    } finally {
      setIsDeleting(false)
    }
  }, [deleteId])

  if (isLoading && comments.length === 0) {
    return <div className={styles.empty}>{t('loading')}</div>
  }

  if (comments.length === 0) {
    return <div className={styles.empty}>{t('noComments')}</div>
  }

  return (
    <>
      <div className={styles.list}>
        {comments.map((comment) => (
          <div key={comment.commentId} className={styles.comment}>
            <div className={styles.commentHeader}>
              <span className={styles.author}>
                {comment.isDeleted
                  ? '—'
                  : comment.userName || `User ${comment.userId}`}
              </span>
              <span className={styles.date}>
                {new Date(comment.createdAt).toLocaleString()}
              </span>
            </div>
            <p
              className={`${styles.content} ${comment.isDeleted ? styles.deleted : ''}`}
            >
              {comment.content}
            </p>
            {!comment.isDeleted && (
              <button
                className={styles.deleteBtn}
                onClick={() => setDeleteId(comment.commentId)}
                type="button"
              >
                {t('delete')}
              </button>
            )}
          </div>
        ))}
      </div>

      {hasMore && (
        <div className={styles.loadMore}>
          <button
            className={styles.loadMoreBtn}
            onClick={() => fetchComments(nextCursor)}
            disabled={isLoading}
            type="button"
          >
            {isLoading ? t('loading') : '+ Load more'}
          </button>
        </div>
      )}

      {deleteId && (
        <div
          className={styles.confirmOverlay}
          onClick={() => setDeleteId(null)}
        >
          <div
            className={styles.confirmModal}
            onClick={(e) => e.stopPropagation()}
          >
            <p className={styles.confirmTitle}>{t('deleteConfirmTitle')}</p>
            <p className={styles.confirmMsg}>{t('deleteConfirmMessage')}</p>
            <div className={styles.confirmActions}>
              <button
                className={`${styles.btn} ${styles.cancelBtn}`}
                onClick={() => setDeleteId(null)}
                type="button"
              >
                {t('cancel')}
              </button>
              <button
                className={`${styles.btn} ${styles.dangerBtn}`}
                onClick={handleDelete}
                disabled={isDeleting}
                type="button"
              >
                {isDeleting ? t('loading') : t('confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
