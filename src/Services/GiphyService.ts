import type { HttpClient } from './HttpClient'
import type { GiphySearchResult } from '../types/giphy'

export interface GiphyService {
  searchGifs: (
    query: string,
    limit?: number,
    offset?: number,
  ) => Promise<GiphySearchResult>
}

export const createGiphyService = (http: HttpClient): GiphyService => ({
  searchGifs: (query, limit = 20, offset = 0) =>
    http.get('/api/v1/giphy/search', {
      q: query,
      limit: String(limit),
      offset: String(offset),
    }),
})
