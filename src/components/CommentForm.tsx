import { useState, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { LoginForm } from 'nauth-react'
import { useComments } from '../hooks/useComments'
import { useAuthGuard } from '../hooks/useAuthGuard'
import { EmojiPicker } from './EmojiPicker'
import { GifPicker } from './GifPicker'
import styles from './CommentForm.module.css'

interface CommentFormProps {
  pageUrl: string
  parentCommentId?: number | null
  placeholder?: string
  onCancel?: () => void
  onSubmitted?: () => void
}

export const CommentForm = ({
  pageUrl,
  parentCommentId = null,
  placeholder,
  onCancel,
  onSubmitted,
}: CommentFormProps) => {
  const { t } = useTranslation()
  const { addComment } = useComments()
  const { guardAction, showLoginModal, closeLoginModal, isAuthenticated } =
    useAuthGuard()
  const [content, setContent] = useState('')
  const [gifUrl, setGifUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleEmojiSelect = useCallback((emoji: string) => {
    setContent((prev) => prev + emoji)
    textareaRef.current?.focus()
  }, [])

  const handleGifSelect = useCallback((url: string) => {
    setGifUrl(url)
  }, [])

  const handleSubmit = useCallback(() => {
    guardAction(async () => {
      if (!content.trim() && !gifUrl) return
      setIsSubmitting(true)
      try {
        await addComment({
          pageUrl,
          content: content.trim(),
          gifUrl,
          parentCommentId,
        })
        setContent('')
        setGifUrl(null)
        onSubmitted?.()
      } finally {
        setIsSubmitting(false)
      }
    })
  }, [
    guardAction,
    content,
    gifUrl,
    pageUrl,
    parentCommentId,
    addComment,
    onSubmitted,
  ])

  const handleFocus = useCallback(() => {
    if (!isAuthenticated) {
      guardAction(() => {})
    }
  }, [isAuthenticated, guardAction])

  const isEmpty = !content.trim() && !gifUrl

  return (
    <>
      <div className={styles.form}>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          placeholder={placeholder || t('writeComment')}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={handleFocus}
          maxLength={2000}
        />

        {gifUrl && (
          <div className={styles.gifPreview}>
            <img src={gifUrl} alt="GIF" />
            <button
              className={styles.removeGif}
              onClick={() => setGifUrl(null)}
              type="button"
            >
              ×
            </button>
          </div>
        )}

        <div className={styles.toolbar}>
          <div className={styles.tools}>
            <EmojiPicker onSelect={handleEmojiSelect} />
            <GifPicker onSelect={handleGifSelect} />
          </div>
          <div>
            {onCancel && (
              <button
                className={styles.submitBtn}
                onClick={onCancel}
                type="button"
                style={{
                  background: 'transparent',
                  color: 'var(--peleja-muted-color, #6c757d)',
                  marginRight: 8,
                }}
              >
                {t('cancel')}
              </button>
            )}
            <button
              className={styles.submitBtn}
              onClick={handleSubmit}
              disabled={isEmpty || isSubmitting}
              type="button"
            >
              {isSubmitting ? t('loading') : t('submit')}
            </button>
          </div>
        </div>
      </div>

      {showLoginModal && (
        <div className={styles.loginOverlay} onClick={closeLoginModal}>
          <div
            className={styles.loginModal}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeBtn} onClick={closeLoginModal} type="button">
              ×
            </button>
            <LoginForm onSuccess={closeLoginModal} />
          </div>
        </div>
      )}
    </>
  )
}
