export interface CursorParams {
  pageUrl: string
  sortBy: 'recent' | 'popular'
  cursor?: string | null
  pageSize?: number
}
