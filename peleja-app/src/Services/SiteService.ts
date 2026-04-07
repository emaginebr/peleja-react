import type { HttpClient } from './HttpClient'
import type { SiteInfo, CreateSiteRequest, UpdateSiteRequest } from '../types/site'

export interface SiteService {
  getSites: () => Promise<SiteInfo[]>
  createSite: (data: CreateSiteRequest) => Promise<SiteInfo>
  updateSite: (siteId: number, data: UpdateSiteRequest) => Promise<SiteInfo>
}

export const createSiteService = (http: HttpClient): SiteService => ({
  getSites: () => http.get('/api/v1/sites'),
  createSite: (data) => http.post('/api/v1/sites', data),
  updateSite: (siteId, data) => http.put(`/api/v1/sites/${siteId}`, data),
})
