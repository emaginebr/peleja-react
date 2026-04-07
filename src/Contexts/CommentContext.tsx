import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from 'react'
import type { ReactNode } from 'react'
import type {
  CommentResult,
  CreateCommentRequest,
  UpdateCommentRequest,
  CommentLikeResult,
} from '../types/comment'
import { createHttpClient } from '../Services/HttpClient'
import { createCommentService } from '../Services/CommentService'
import type { CommentService } from '../Services/CommentService'
import { createGiphyService } from '../Services/GiphyService'
import type { GiphyService } from '../Services/GiphyService'

interface CommentState {
  comments: CommentResult[]
  nextCursor: string | null
  hasMore: boolean
  isLoading: boolean
  error: string | null
  sortBy: 'recent' | 'popular'
}

type CommentAction =
  | { type: 'LOAD_START' }
  | {
      type: 'LOAD_SUCCESS'
      payload: {
        items: CommentResult[]
        nextCursor: string | null
        hasMore: boolean
        append: boolean
      }
    }
  | { type: 'LOAD_ERROR'; payload: string }
  | { type: 'SET_SORT'; payload: 'recent' | 'popular' }
  | { type: 'ADD_COMMENT'; payload: CommentResult }
  | { type: 'UPDATE_COMMENT'; payload: CommentResult }
  | { type: 'DELETE_COMMENT'; payload: number }
  | { type: 'TOGGLE_LIKE'; payload: CommentLikeResult }
  | { type: 'CLEAR_ERROR' }

const initialState: CommentState = {
  comments: [],
  nextCursor: null,
  hasMore: false,
  isLoading: false,
  error: null,
  sortBy: 'recent',
}

const updateCommentInList = (
  comments: CommentResult[],
  commentId: number,
  updater: (c: CommentResult) => CommentResult,
): CommentResult[] =>
  comments.map((c) => {
    if (c.commentId === commentId) return updater(c)
    if (c.replies) {
      return {
        ...c,
        replies: c.replies.map((r) =>
          r.commentId === commentId ? updater(r) : r,
        ),
      }
    }
    return c
  })

const commentReducer = (
  state: CommentState,
  action: CommentAction,
): CommentState => {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, isLoading: true, error: null }
    case 'LOAD_SUCCESS':
      return {
        ...state,
        isLoading: false,
        comments: action.payload.append
          ? [...state.comments, ...action.payload.items]
          : action.payload.items,
        nextCursor: action.payload.nextCursor,
        hasMore: action.payload.hasMore,
      }
    case 'LOAD_ERROR':
      return { ...state, isLoading: false, error: action.payload }
    case 'SET_SORT':
      return { ...state, sortBy: action.payload, comments: [], nextCursor: null }
    case 'ADD_COMMENT': {
      const comment = action.payload
      if (comment.parentCommentId) {
        return {
          ...state,
          comments: state.comments.map((c) =>
            c.commentId === comment.parentCommentId
              ? { ...c, replies: [...(c.replies || []), comment] }
              : c,
          ),
        }
      }
      return { ...state, comments: [comment, ...state.comments] }
    }
    case 'UPDATE_COMMENT':
      return {
        ...state,
        comments: updateCommentInList(
          state.comments,
          action.payload.commentId,
          () => action.payload,
        ),
      }
    case 'DELETE_COMMENT':
      return {
        ...state,
        comments: updateCommentInList(
          state.comments,
          action.payload,
          (c) => ({
            ...c,
            content: '[Comment removed]',
            gifUrl: null,
            isDeleted: true,
            userId: 0,
            userName: '',
            userImageUrl: null,
          }),
        ),
      }
    case 'TOGGLE_LIKE':
      return {
        ...state,
        comments: updateCommentInList(
          state.comments,
          action.payload.commentId,
          (c) => ({
            ...c,
            likeCount: action.payload.likeCount,
            isLikedByUser: action.payload.isLikedByUser,
          }),
        ),
      }
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    default:
      return state
  }
}

export interface CommentContextType {
  state: CommentState
  loadComments: () => Promise<void>
  loadMore: () => Promise<void>
  setSortBy: (sortBy: 'recent' | 'popular') => void
  addComment: (data: CreateCommentRequest) => Promise<void>
  editComment: (
    commentId: number,
    data: UpdateCommentRequest,
  ) => Promise<void>
  deleteComment: (commentId: number) => Promise<void>
  toggleLike: (commentId: number) => Promise<void>
  clearError: () => void
  service: CommentService
  giphyService: GiphyService
}

export const CommentContext = createContext<CommentContextType | null>(null)

interface CommentProviderProps {
  apiUrl: string
  clientId: string
  pageUrl: string
  getToken: () => string | null
  children: ReactNode
}

export const CommentProvider = ({
  apiUrl,
  clientId,
  pageUrl,
  getToken,
  children,
}: CommentProviderProps) => {
  const [state, dispatch] = useReducer(commentReducer, initialState)

  const { service, giphyService } = useMemo(() => {
    const http = createHttpClient(apiUrl, clientId, getToken)
    return {
      service: createCommentService(http),
      giphyService: createGiphyService(http),
    }
  }, [apiUrl, clientId, getToken])

  const loadComments = useCallback(async () => {
    dispatch({ type: 'LOAD_START' })
    try {
      const result = await service.getComments({
        pageUrl,
        sortBy: state.sortBy,
      })
      dispatch({
        type: 'LOAD_SUCCESS',
        payload: { ...result, append: false },
      })
    } catch (err: unknown) {
      const error = err as { status?: number; detail?: string }
      if (error.status === 403) {
        dispatch({ type: 'LOAD_ERROR', payload: 'errorBlocked' })
      } else {
        dispatch({ type: 'LOAD_ERROR', payload: 'errorLoading' })
      }
    }
  }, [service, pageUrl, state.sortBy])

  const loadMore = useCallback(async () => {
    if (state.isLoading || !state.hasMore || !state.nextCursor) return
    dispatch({ type: 'LOAD_START' })
    try {
      const result = await service.getComments({
        pageUrl,
        sortBy: state.sortBy,
        cursor: state.nextCursor,
      })
      dispatch({
        type: 'LOAD_SUCCESS',
        payload: { ...result, append: true },
      })
    } catch {
      dispatch({ type: 'LOAD_ERROR', payload: 'errorLoading' })
    }
  }, [service, pageUrl, state.sortBy, state.nextCursor, state.isLoading, state.hasMore])

  const setSortBy = useCallback((sortBy: 'recent' | 'popular') => {
    dispatch({ type: 'SET_SORT', payload: sortBy })
  }, [])

  const addComment = useCallback(
    async (data: CreateCommentRequest) => {
      const comment = await service.createComment(data)
      dispatch({ type: 'ADD_COMMENT', payload: comment })
    },
    [service],
  )

  const editComment = useCallback(
    async (commentId: number, data: UpdateCommentRequest) => {
      const comment = await service.updateComment(commentId, data)
      dispatch({ type: 'UPDATE_COMMENT', payload: comment })
    },
    [service],
  )

  const deleteComment = useCallback(
    async (commentId: number) => {
      await service.deleteComment(commentId)
      dispatch({ type: 'DELETE_COMMENT', payload: commentId })
    },
    [service],
  )

  const toggleLike = useCallback(
    async (commentId: number) => {
      const result = await service.toggleLike(commentId)
      dispatch({ type: 'TOGGLE_LIKE', payload: result })
    },
    [service],
  )

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' })
  }, [])

  useEffect(() => {
    loadComments()
  }, [loadComments])

  const value = useMemo(
    () => ({
      state,
      loadComments,
      loadMore,
      setSortBy,
      addComment,
      editComment,
      deleteComment,
      toggleLike,
      clearError,
      service,
      giphyService,
    }),
    [
      state,
      loadComments,
      loadMore,
      setSortBy,
      addComment,
      editComment,
      deleteComment,
      toggleLike,
      clearError,
      service,
      giphyService,
    ],
  )

  return (
    <CommentContext.Provider value={value}>{children}</CommentContext.Provider>
  )
}
