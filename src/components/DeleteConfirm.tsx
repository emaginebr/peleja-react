import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useComments } from '../hooks/useComments'
import styles from './DeleteConfirm.module.css'

interface DeleteConfirmProps {
  commentId: number
  onCancel: () => void
}

export const DeleteConfirm = ({ commentId, onCancel }: DeleteConfirmProps) => {
  const { t } = useTranslation()
  const { deleteComment } = useComments()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirm = useCallback(async () => {
    setIsDeleting(true)
    try {
      await deleteComment(commentId)
      onCancel()
    } finally {
      setIsDeleting(false)
    }
  }, [commentId, deleteComment, onCancel])

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <p className={styles.title}>{t('deleteConfirmTitle')}</p>
        <p className={styles.message}>{t('deleteConfirmMessage')}</p>
        <div className={styles.actions}>
          <button
            className={`${styles.btn} ${styles.cancelBtn}`}
            onClick={onCancel}
            type="button"
          >
            {t('cancel')}
          </button>
          <button
            className={`${styles.btn} ${styles.confirmBtn}`}
            onClick={handleConfirm}
            disabled={isDeleting}
            type="button"
          >
            {isDeleting ? t('loading') : t('confirm')}
          </button>
        </div>
      </div>
    </div>
  )
}
