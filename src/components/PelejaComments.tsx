import { useCallback } from 'react'
import { useAuth } from 'nauth-react'
import { initI18n } from '../i18n'
import type { PelejaCommentsProps } from '../types/comment'
import { CommentProvider } from '../Contexts/CommentContext'
import { useComments } from '../hooks/useComments'
import { SortSelector } from './SortSelector'
import { CommentForm } from './CommentForm'
import { CommentList } from './CommentList'
import styles from './PelejaComments.module.css'

export const PelejaComments = ({
  clientId,
  pageUrl,
  apiUrl,
  language = 'pt-BR',
  className,
}: PelejaCommentsProps) => {
  initI18n(language)

  const { token } = useAuth()

  const getToken = useCallback(() => token ?? null, [token])

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <CommentProvider
        apiUrl={apiUrl}
        clientId={clientId}
        pageUrl={pageUrl}
        getToken={getToken}
      >
        <PelejaCommentsInner pageUrl={pageUrl} />
      </CommentProvider>
    </div>
  )
}

const PelejaCommentsInner = ({ pageUrl }: { pageUrl: string }) => {
  const { state, setSortBy } = useComments()

  return (
    <>
      <CommentForm pageUrl={pageUrl} />
      <div className={styles.header}>
        <SortSelector value={state.sortBy} onChange={setSortBy} />
      </div>
      <CommentList pageUrl={pageUrl} />
    </>
  )
}
