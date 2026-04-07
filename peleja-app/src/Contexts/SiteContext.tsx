import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from 'react'
import type { ReactNode } from 'react'
import { useAuth } from 'nauth-react'
import type { SiteInfo, CreateSiteRequest, UpdateSiteRequest } from '../types/site'
import { createHttpClient } from '../Services/HttpClient'
import { createSiteService } from '../Services/SiteService'
import type { SiteService } from '../Services/SiteService'

interface SiteState {
  sites: SiteInfo[]
  nextCursor: string | null
  hasMore: boolean
  isLoading: boolean
  error: string | null
}

type SiteAction =
  | { type: 'LOAD_START' }
  | {
      type: 'LOAD_SUCCESS'
      payload: { items: SiteInfo[]; nextCursor: string | null; hasMore: boolean; append: boolean }
    }
  | { type: 'LOAD_ERROR'; payload: string }
  | { type: 'ADD_SITE'; payload: SiteInfo }
  | { type: 'UPDATE_SITE'; payload: SiteInfo }
  | { type: 'CLEAR_ERROR' }

const initialState: SiteState = {
  sites: [],
  nextCursor: null,
  hasMore: false,
  isLoading: false,
  error: null,
}

const siteReducer = (state: SiteState, action: SiteAction): SiteState => {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, isLoading: true, error: null }
    case 'LOAD_SUCCESS':
      return {
        ...state,
        isLoading: false,
        sites: action.payload.append
          ? [...state.sites, ...action.payload.items]
          : action.payload.items,
        nextCursor: action.payload.nextCursor,
        hasMore: action.payload.hasMore,
      }
    case 'LOAD_ERROR':
      return { ...state, isLoading: false, error: action.payload }
    case 'ADD_SITE':
      return { ...state, sites: [...state.sites, action.payload] }
    case 'UPDATE_SITE':
      return {
        ...state,
        sites: state.sites.map((s) =>
          s.siteId === action.payload.siteId ? action.payload : s,
        ),
      }
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    default:
      return state
  }
}

export interface SiteContextType {
  state: SiteState
  loadSites: () => Promise<void>
  loadMoreSites: () => Promise<void>
  createSite: (data: CreateSiteRequest) => Promise<void>
  updateSite: (siteId: number, data: UpdateSiteRequest) => Promise<void>
  clearError: () => void
  service: SiteService
}

export const SiteContext = createContext<SiteContextType | null>(null)

interface SiteProviderProps {
  children: ReactNode
}

export const SiteProvider = ({ children }: SiteProviderProps) => {
  const { token, isAuthenticated } = useAuth()
  const [state, dispatch] = useReducer(siteReducer, initialState)

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
  const tenantId = import.meta.env.VITE_TENANT_ID || 'emagine'

  const service = useMemo(() => {
    const http = createHttpClient(apiUrl, tenantId, () => token ?? null)
    return createSiteService(http)
  }, [apiUrl, tenantId, token])

  const loadSites = useCallback(async () => {
    dispatch({ type: 'LOAD_START' })
    try {
      const result = await service.getSites()
      dispatch({
        type: 'LOAD_SUCCESS',
        payload: { ...result, append: false },
      })
    } catch {
      dispatch({ type: 'LOAD_ERROR', payload: 'error' })
    }
  }, [service])

  const loadMoreSites = useCallback(async () => {
    if (state.isLoading || !state.hasMore || !state.nextCursor) return
    dispatch({ type: 'LOAD_START' })
    try {
      const result = await service.getSites(state.nextCursor)
      dispatch({
        type: 'LOAD_SUCCESS',
        payload: { ...result, append: true },
      })
    } catch {
      dispatch({ type: 'LOAD_ERROR', payload: 'error' })
    }
  }, [service, state.isLoading, state.hasMore, state.nextCursor])

  const createSite = useCallback(
    async (data: CreateSiteRequest) => {
      const site = await service.createSite(data)
      dispatch({ type: 'ADD_SITE', payload: site })
    },
    [service],
  )

  const updateSite = useCallback(
    async (siteId: number, data: UpdateSiteRequest) => {
      const site = await service.updateSite(siteId, data)
      dispatch({ type: 'UPDATE_SITE', payload: site })
    },
    [service],
  )

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' })
  }, [])

  useEffect(() => {
    if (isAuthenticated) loadSites()
  }, [isAuthenticated, loadSites])

  const value = useMemo(
    () => ({ state, loadSites, loadMoreSites, createSite, updateSite, clearError, service }),
    [state, loadSites, loadMoreSites, createSite, updateSite, clearError, service],
  )

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}
