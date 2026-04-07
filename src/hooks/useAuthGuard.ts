import { useState, useCallback } from 'react'
import { useAuth } from 'nauth-react'

export const useAuthGuard = () => {
  const { isAuthenticated } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)

  const guardAction = useCallback(
    (callback: () => void) => {
      if (isAuthenticated) {
        callback()
      } else {
        setShowLoginModal(true)
      }
    },
    [isAuthenticated],
  )

  const closeLoginModal = useCallback(() => {
    setShowLoginModal(false)
  }, [])

  return {
    isAuthenticated,
    showLoginModal,
    guardAction,
    closeLoginModal,
  }
}
