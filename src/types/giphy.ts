export interface GiphyItem {
  id: string
  title: string
  url: string
  previewUrl: string
  width: number
  height: number
}

export interface GiphySearchResult {
  items: GiphyItem[]
  totalCount: number
  offset: number
  limit: number
}
