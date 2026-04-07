export enum SiteStatus {
  Active = 1,
  Blocked = 2,
  Inactive = 3,
}

export interface SiteInfo {
  siteId: number
  clientId: string
  siteUrl: string
  tenant: string
  userId: number
  status: SiteStatus
  createdAt: string
}

export interface CreateSiteRequest {
  siteUrl: string
  tenant: string
}

export interface UpdateSiteRequest {
  siteUrl?: string
  status?: SiteStatus.Active | SiteStatus.Inactive
}
