import { useState, useRef, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useComments } from '../hooks/useComments'
import type { GiphyItem } from '../types/giphy'
import styles from './GifPicker.module.css'

interface GifPickerProps {
  onSelect: (url: string) => void
}

export const GifPicker = ({ onSelect }: GifPickerProps) => {
  const { t } = useTranslation()
  const { giphyService } = useComments()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [gifs, setGifs] = useState<GiphyItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const searchGifs = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setGifs([])
        return
      }
      setIsLoading(true)
      setError(null)
      try {
        const result = await giphyService.searchGifs(searchQuery)
        setGifs(result.items)
      } catch (err: unknown) {
        const apiError = err as { status?: number }
        if (apiError.status === 503) {
          setError(t('gifUnavailable'))
        } else {
          setError(t('tryAgain'))
        }
      } finally {
        setIsLoading(false)
      }
    },
    [giphyService, t],
  )

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!query.trim()) {
      setGifs([])
      return
    }
    debounceRef.current = setTimeout(() => {
      searchGifs(query)
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, searchGifs])

  const handleSelect = (gif: GiphyItem) => {
    onSelect(gif.url)
    setIsOpen(false)
    setQuery('')
    setGifs([])
  }

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button
        className={styles.toggle}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        aria-label="GIF"
      >
        GIF
      </button>
      {isOpen && (
        <>
          <div
            className={styles.overlay}
            onClick={() => setIsOpen(false)}
          />
          <div className={styles.popover}>
            <input
              className={styles.searchInput}
              type="text"
              placeholder={t('searchGifs')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            {isLoading && <div className={styles.message}>{t('loading')}</div>}
            {error && <div className={styles.message}>{error}</div>}
            {!isLoading && !error && gifs.length > 0 && (
              <div className={styles.grid}>
                {gifs.map((gif) => (
                  <button
                    key={gif.id}
                    className={styles.gifItem}
                    onClick={() => handleSelect(gif)}
                    type="button"
                  >
                    <img src={gif.previewUrl} alt={gif.title} loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
