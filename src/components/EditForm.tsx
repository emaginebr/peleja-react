import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useComments } from '../hooks/useComments'
import styles from './EditForm.module.css'

interface EditFormProps {
  commentId: number
  initialContent: string
  initialGifUrl: string | null
  onCancel: () => void
}

export const EditForm = ({
  commentId,
  initialContent,
  initialGifUrl,
  onCancel,
}: EditFormProps) => {
  const { t } = useTranslation()
  const { editComment } = useComments()
  const [content, setContent] = useState(initialContent)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = useCallback(async () => {
    if (!content.trim()) return
    setIsSaving(true)
    try {
      await editComment(commentId, {
        content: content.trim(),
        gifUrl: initialGifUrl,
      })
      onCancel()
    } finally {
      setIsSaving(false)
    }
  }, [commentId, content, initialGifUrl, editComment, onCancel])

  return (
    <div className={styles.form}>
      <textarea
        className={styles.textarea}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={2000}
        autoFocus
      />
      <div className={styles.actions}>
        <button
          className={`${styles.btn} ${styles.cancelBtn}`}
          onClick={onCancel}
          type="button"
        >
          {t('cancel')}
        </button>
        <button
          className={`${styles.btn} ${styles.saveBtn}`}
          onClick={handleSave}
          disabled={!content.trim() || isSaving}
          type="button"
        >
          {isSaving ? t('loading') : t('save')}
        </button>
      </div>
    </div>
  )
}
