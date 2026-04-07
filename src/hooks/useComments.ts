import { useContext } from 'react'
import { CommentContext } from '../Contexts/CommentContext'
import type { CommentContextType } from '../Contexts/CommentContext'

export const useComments = (): CommentContextType => {
  const context = useContext(CommentContext)
  if (!context) {
    throw new Error('useComments must be used within a CommentProvider')
  }
  return context
}
