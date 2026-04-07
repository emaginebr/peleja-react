import { useTranslation } from 'react-i18next'
import { useComments } from '../hooks/useComments'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'
import { CommentItem } from './CommentItem'
import { EmptyState } from './EmptyState'
import styles from './CommentList.module.css'
import containerStyles from './PelejaComments.module.css'

interface CommentListProps {
  pageUrl: string
}

export const CommentList = ({ pageUrl }: CommentListProps) => {
  const { t } = useTranslation()
  const { state, loadMore } = useComments()
  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore: state.hasMore,
    isLoading: state.isLoading,
  })

  if (state.error) {
    return (
      <div className={containerStyles.error}>
        <p>{t(state.error)}</p>
      </div>
    )
  }

  if (!state.isLoading && state.comments.length === 0) {
    return <EmptyState />
  }

  return (
    <div>
      <div className={styles.list}>
        {state.comments.map((comment) => (
          <CommentItem key={comment.commentId} comment={comment} pageUrl={pageUrl} />
        ))}
      </div>

      {state.isLoading && (
        <div className={styles.loadingMore}>
          <div className={containerStyles.spinner} />
        </div>
      )}

      <div ref={sentinelRef} className={styles.sentinel} />
    </div>
  )
}
