import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from 'nauth-react'
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
  userName: string
}

interface PaginatedComments {
  items: CommentResult[]
  nextCursor: string | null
  hasMore: boolean
}

interface CommentListProps {
  clientId: string
  pageUrl: string
}

export const CommentList = ({ clientId, pageUrl }: CommentListProps) => {
  const { t } = useTranslation()
  const { token } = useAuth()
  const [comments, setComments] = useState<CommentResult[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  const fetchComments = useCallback(
    async (cursor?: string | null) => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams({ pageUrl })
        if (cursor) params.set('cursor', cursor)
        const response = await fetch(
          `${apiUrl}/api/v1/comments?${params}`,
          {
            headers: {
              'X-Client-Id': clientId,
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          },
        )
        const data: PaginatedComments = await response.json()
        if (cursor) {
          setComments((prev) => [...prev, ...data.items])
        } else {
          setComments(data.items)
        }
        setNextCursor(data.nextCursor)
        setHasMore(data.hasMore)
      } finally {
        setIsLoading(false)
      }
    },
    [apiUrl, clientId, pageUrl, token],
  )

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  const handleDelete = useCallback(async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await fetch(`${apiUrl}/api/v1/comments/${deleteId}`, {
        method: 'DELETE',
        headers: {
          'X-Client-Id': clientId,
          Authorization: `Bearer ${token}`,
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
  }, [deleteId, apiUrl, clientId, token])

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
                {comment.isDeleted ? '—' : comment.userName}
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
        <div className={styles.confirmOverlay} onClick={() => setDeleteId(null)}>
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
