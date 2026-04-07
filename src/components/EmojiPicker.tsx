import { useState, useRef, useEffect } from 'react'
import EmojiPickerReact from 'emoji-picker-react'
import type { EmojiClickData } from 'emoji-picker-react'
import styles from './EmojiPicker.module.css'

interface EmojiPickerProps {
  onSelect: (emoji: string) => void
}

export const EmojiPicker = ({ onSelect }: EmojiPickerProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

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

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onSelect(emojiData.emoji)
    setIsOpen(false)
  }

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button
        className={styles.toggle}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        aria-label="Emoji"
      >
        😊
      </button>
      {isOpen && (
        <>
          <div
            className={styles.overlay}
            onClick={() => setIsOpen(false)}
          />
          <div className={styles.popover}>
            <EmojiPickerReact
              onEmojiClick={handleEmojiClick}
              searchDisabled={false}
              skinTonesDisabled
              width={320}
              height={400}
            />
          </div>
        </>
      )}
    </div>
  )
}
