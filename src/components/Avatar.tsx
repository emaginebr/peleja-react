import styles from './Avatar.module.css'

interface AvatarProps {
  name: string
  imageUrl: string | null
}

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return (name[0] || '?').toUpperCase()
}

export const Avatar = ({ name, imageUrl }: AvatarProps) => (
  <div className={styles.avatar}>
    {imageUrl ? (
      <img src={imageUrl} alt={name} />
    ) : (
      getInitials(name)
    )}
  </div>
)
