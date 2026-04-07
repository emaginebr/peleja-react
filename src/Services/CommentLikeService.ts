import type { HttpClient } from './HttpClient'
import type { CommentLikeResult } from '../types/comment'

export interface CommentLikeService {
  toggleLike: (commentId: number) => Promise<CommentLikeResult>
}

export const createCommentLikeService = (
  http: HttpClient,
): CommentLikeService => ({
  toggleLike: (commentId) =>
    http.post(`/api/v1/comments/${commentId}/like`),
})
