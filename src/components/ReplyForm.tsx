import { useTranslation } from 'react-i18next'
import { CommentForm } from './CommentForm'

interface ReplyFormProps {
  pageUrl: string
  parentCommentId: number
  onCancel: () => void
}

export const ReplyForm = ({
  pageUrl,
  parentCommentId,
  onCancel,
}: ReplyFormProps) => {
  const { t } = useTranslation()

  return (
    <CommentForm
      pageUrl={pageUrl}
      parentCommentId={parentCommentId}
      placeholder={t('writeReply')}
      onCancel={onCancel}
      onSubmitted={onCancel}
    />
  )
}
