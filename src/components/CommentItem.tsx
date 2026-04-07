import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from 'nauth-react'
import type { CommentResult } from '../types/comment'
import { useComments } from '../hooks/useComments'
import { useAuthGuard } from '../hooks/useAuthGuard'
import { Avatar } from './Avatar'
import { ReplyForm } from './ReplyForm'
import { EditForm } from './EditForm'
import { DeleteConfirm } from './DeleteConfirm'
import { AuthModal } from './AuthModal'
import styles from './CommentItem.module.css'

interface CommentItemProps {
  comment: CommentResult
  pageUrl: string
  isReply?: boolean
}

const formatRelativeDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMinutes < 1) return 'agora'
  if (diffMinutes < 60) return `${diffMinutes}m`
  if (diffHours < 24) return `${diffHours}h`
  if (diffDays < 30) return `${diffDays}d`
  return date.toLocaleDateString()
}

export const CommentItem = ({
  comment,
  pageUrl,
  isReply = false,
}: CommentItemProps) => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { toggleLike } = useComments()
  const { guardAction, showLoginModal, closeLoginModal } = useAuthGuard()
  const [showReply, setShowReply] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  const isAuthor = user && user.userId === comment.userId
  const isAdmin = user && user.isAdmin

  const handleLike = useCallback(() => {
    guardAction(() => {
      toggleLike(comment.commentId)
    })
  }, [guardAction, toggleLike, comment.commentId])

  const handleReply = useCallback(() => {
    guardAction(() => {
      setShowReply(true)
    })
  }, [guardAction])

  if (comment.isDeleted) {
    return (
      <div className={styles.comment}>
        <Avatar name="?" imageUrl={null} />
        <div className={styles.body}>
          <p className={`${styles.content} ${styles.deletedContent}`}>
            [{t('commentRemoved')}]
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.comment}>
      <Avatar name={comment.userName || `User ${comment.userId}`} imageUrl={comment.userImageUrl ?? null} />
      <div className={styles.body}>
        <div className={styles.header}>
          <span className={styles.author}>{comment.userName || `User ${comment.userId}`}</span>
          <span className={styles.date}>
            {formatRelativeDate(comment.createdAt)}
          </span>
          {comment.isEdited && (
            <span className={styles.editedBadge}>({t('edited')})</span>
          )}
        </div>

        {showEdit ? (
          <EditForm
            commentId={comment.commentId}
            initialContent={comment.content}
            initialGifUrl={comment.gifUrl}
            onCancel={() => setShowEdit(false)}
          />
        ) : (
          <>
            <p className={styles.content}>{comment.content}</p>

            {comment.gifUrl && (
              <img
                src={comment.gifUrl}
                alt="GIF"
                className={styles.gif}
                loading="lazy"
              />
            )}
          </>
        )}

        <div className={styles.actions}>
          <button
            className={`${styles.actionBtn} ${comment.isLikedByUser ? styles.liked : ''}`}
            onClick={handleLike}
            type="button"
          >
            ♥ {comment.likeCount > 0 && comment.likeCount}
          </button>
          {!isReply && (
            <button
              className={styles.actionBtn}
              onClick={handleReply}
              type="button"
            >
              {t('reply')}
            </button>
          )}
          {isAuthor && !showEdit && (
            <button
              className={styles.actionBtn}
              onClick={() => setShowEdit(true)}
              type="button"
            >
              {t('edit')}
            </button>
          )}
          {(isAuthor || isAdmin) && (
            <button
              className={styles.actionBtn}
              onClick={() => setShowDelete(true)}
              type="button"
            >
              {t('delete')}
            </button>
          )}
        </div>

        {showReply && (
          <ReplyForm
            pageUrl={pageUrl}
            parentCommentId={comment.commentId}
            onCancel={() => setShowReply(false)}
          />
        )}

        {!isReply && comment.replies && comment.replies.length > 0 && (
          <div className={styles.replies}>
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.commentId}
                comment={reply}
                pageUrl={pageUrl}
                isReply
              />
            ))}
          </div>
        )}
      </div>

      {showDelete && (
        <DeleteConfirm
          commentId={comment.commentId}
          onCancel={() => setShowDelete(false)}
        />
      )}

      {showLoginModal && (
        <AuthModal onSuccess={closeLoginModal} onClose={closeLoginModal} />
      )}
    </div>
  )
}
