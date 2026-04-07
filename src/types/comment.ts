export interface CommentResult {
  commentId: number
  content: string
  gifUrl: string | null
  isEdited: boolean
  isDeleted: boolean
  likeCount: number
  isLikedByUser: boolean
  createdAt: string
  parentCommentId: number | null
  userId: number
  userName: string
  userImageUrl: string | null
  replies: CommentResult[] | null
}

export interface PaginatedResult<T> {
  items: T[]
  nextCursor: string | null
  hasMore: boolean
}

export interface CommentLikeResult {
  commentId: number
  likeCount: number
  isLikedByUser: boolean
}

export interface CreateCommentRequest {
  pageUrl: string
  content: string
  gifUrl?: string | null
  parentCommentId?: number | null
}

export interface UpdateCommentRequest {
  content: string
  gifUrl?: string | null
}

export interface PelejaCommentsProps {
  clientId: string
  pageUrl: string
  apiUrl: string
  language?: 'pt-BR' | 'en'
  className?: string
}
