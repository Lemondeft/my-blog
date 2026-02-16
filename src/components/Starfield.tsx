import { useMemo } from 'react'

interface Star {
  top: string
  left: string
  size: string
  opacity: number
  color: string
}

export default function Starfield() {
  const stars = useMemo(() => {
    const colors = [
      '#ffffff',
      '#a78bfa', // purple
      '#93c5fd', // blue
      '#c4b5fd', // light purple
      '#e0f2fe', // ice white
    ]

    return Array.from({ length: 150 }, (): Star => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      opacity: Math.random() * 0.7 + 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
      {stars.map((star, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            borderRadius: '50%',
            backgroundColor: star.color,
            opacity: star.opacity,
          }}
        />
      ))}
    </div>
  )
}