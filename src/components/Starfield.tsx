import { useMemo } from "react"

interface Star {
  top: string
  left: string
  size: string
  opacity: number
  color: string
  delay: string
  duration: string
}

const driftClasses = ["animate-drift-0", "animate-drift-1", "animate-drift-2"]

export default function Starfield() {
  const layers = [100, 70, 40]
  const colors = ["#ffffff", "#93c5fd", "#a78bfa", "#e0f2fe"]

  const starLayers = useMemo(() => {
    return layers.map(count =>
      Array.from({ length: count }, (): Star => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: `${Math.random() * 2 + 0.5}px`,
        opacity: Math.random() * 0.7 + 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: `${Math.random() * 5}s`,
        duration: `${Math.random() * 3 + 2}s`,
      }))
    )
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden z-0 pointer-events-none">
      {starLayers.map((stars, layer) => (
        <div key={layer} className={`absolute inset-0 ${driftClasses[layer]}`}>
          {stars.map((star, i) => (
            <div
              key={i}
              className="absolute rounded-full blur-[0.5px]"
              style={{
                top: star.top,
                left: star.left,
                width: star.size,
                height: star.size,
                backgroundColor: star.color,
                opacity: star.opacity,
                animation: `twinkle ${star.duration} ease-in-out ${star.delay} infinite alternate`,
                boxShadow: `0 0 6px ${star.color}`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
