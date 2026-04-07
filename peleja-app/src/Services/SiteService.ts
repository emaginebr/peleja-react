import type { HttpClient } from './HttpClient'
import type { SiteInfo, CreateSiteRequest, UpdateSiteRequest } from '../types/site'

interface PaginatedResult<T> {
  items: T[]
  nextCursor: string | null
  hasMore: boolean
}

export interface PageInfo {
  pageId: number
  pageUrl: string
  commentCount: number
  createdAt: string
}

export interface SiteService {
  getSites: (cursor?: string) => Promise<PaginatedResult<SiteInfo>>
  createSite: (data: CreateSiteRequest) => Promise<SiteInfo>
  updateSite: (siteId: number, data: UpdateSiteRequest) => Promise<SiteInfo>
  getPages: (siteId: number, cursor?: string) => Promise<PaginatedResult<PageInfo>>
  getPageComments: (siteId: number, pageId: number, cursor?: string) => Promise<PaginatedResult<unknown>>
}

export const createSiteService = (http: HttpClient): SiteService => ({
  getSites: (cursor) => {
    const params: Record<string, string> = {}
    if (cursor) params.cursor = cursor
    return http.get('/api/v1/sites', params)
  },
  createSite: (data) => http.post('/api/v1/sites', data),
  updateSite: (siteId, data) => http.put(`/api/v1/sites/${siteId}`, data),
  getPages: (siteId, cursor) => {
    const params: Record<string, string> = {}
    if (cursor) params.cursor = cursor
    return http.get(`/api/v1/sites/${siteId}/pages`, params)
  },
  getPageComments: (siteId, pageId, cursor) => {
    const params: Record<string, string> = {}
    if (cursor) params.cursor = cursor
    return http.get(`/api/v1/sites/${siteId}/pages/${pageId}/comments`, params)
  },
})
