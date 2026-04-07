import type { HttpClient } from './HttpClient'
import type {
  CommentResult,
  PaginatedResult,
  CreateCommentRequest,
  UpdateCommentRequest,
  CommentLikeResult,
} from '../types/comment'
import type { CursorParams } from '../types/pagination'

export interface CommentService {
  getComments: (params: CursorParams) => Promise<PaginatedResult<CommentResult>>
  createComment: (data: CreateCommentRequest) => Promise<CommentResult>
  updateComment: (
    commentId: number,
    data: UpdateCommentRequest,
  ) => Promise<CommentResult>
  deleteComment: (commentId: number) => Promise<void>
  toggleLike: (commentId: number) => Promise<CommentLikeResult>
}

export const createCommentService = (http: HttpClient): CommentService => ({
  getComments: (params) => {
    const queryParams: Record<string, string> = {
      pageUrl: params.pageUrl,
      sortBy: params.sortBy,
    }
    if (params.cursor) queryParams.cursor = params.cursor
    if (params.pageSize) queryParams.pageSize = String(params.pageSize)
    return http.get('/api/v1/comments', queryParams)
  },

  createComment: (data) => http.post('/api/v1/comments', data),

  updateComment: (commentId, data) =>
    http.put(`/api/v1/comments/${commentId}`, data),

  deleteComment: (commentId) => http.del(`/api/v1/comments/${commentId}`),

  toggleLike: (commentId) =>
    http.post(`/api/v1/comments/${commentId}/like`),
})
