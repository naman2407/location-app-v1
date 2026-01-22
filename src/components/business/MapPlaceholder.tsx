'use client'

interface MapPlaceholderProps {
  text?: string
  className?: string
}

export function MapPlaceholder({ text = 'Map placeholder', className }: MapPlaceholderProps) {
  return (
    <div className={['map-placeholder', className].filter(Boolean).join(' ')}>
      <span>{text}</span>
    </div>
  )
}
