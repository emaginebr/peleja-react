import { useContext } from 'react'
import { SiteContext } from '../Contexts/SiteContext'
import type { SiteContextType } from '../Contexts/SiteContext'

export const useSites = (): SiteContextType => {
  const context = useContext(SiteContext)
  if (!context) {
    throw new Error('useSites must be used within a SiteProvider')
  }
  return context
}
