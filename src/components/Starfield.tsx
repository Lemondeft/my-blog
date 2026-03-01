import { useMemo, useState, useEffect, useCallback } from "react"

interface Star {
  top: string
  left: string
  size: number
  opacity: number
  color: string
  delay: string
  duration: string
  glow: number
  blur: number
}

interface ShootingStar {
  id: number
  top: string
  left: string
  angle: number
  duration: number
  length: number
  distance: number
}

const driftClasses = ["animate-drift-0", "animate-drift-1", "animate-drift-2"]

export default function Starfield() {
  const layers = [90, 40, 20]
  const colors = ["#ffffff", "#93c5fd", "#a78bfa", "#e0f2fe", "#c4b5fd", "#bae6fd"]

  const starLayers = useMemo(() => {
    return layers.map((count, layerIdx) =>
      Array.from({ length: count }, (): Star => {
        const isBright = Math.random() < 0.08
        const size = isBright
          ? Math.random() * 2.5 + 2
          : Math.random() * 1.8 + 0.4
        return {
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          size,
          opacity: isBright
            ? Math.random() * 0.3 + 0.7
            : Math.random() * 0.5 + 0.2 + layerIdx * 0.1,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: `${Math.random() * 8}s`,
          duration: `${Math.random() * 4 + 2}s`,
          glow: isBright ? size * 4 : size * 2.5,
          blur: isBright ? 0.3 : 0.5,
        }
      })
    )
  }, [])

  // Shooting stars: spawn one at a random position, plays once, then removed
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([])
  const idRef = useMemo(() => ({ current: 0 }), [])

  const spawnShootingStar = useCallback(() => {
    const id = idRef.current++
    const duration = Math.random() * 0.6 + 0.6
    const angle = Math.random() * 30 + 15
    const distance = Math.random() * 150 + 150
    const star: ShootingStar = {
      id,
      top: `${Math.random() * 45}%`,
      left: `${Math.random() * 85 + 5}%`,
      angle,
      duration,
      length: Math.random() * 80 + 60,
      distance,
    }
    setShootingStars(prev => [...prev, star])
    setTimeout(() => {
      setShootingStars(prev => prev.filter(s => s.id !== id))
    }, duration * 1000 + 100)
  }, [idRef])

  useEffect(() => {
    const scheduleNext = () => {
      // Random interval between 4–12 seconds
      const delay = Math.random() * 2000 + 2000
      return setTimeout(() => {
        spawnShootingStar()
        timerRef = scheduleNext()
      }, delay)
    }
    let timerRef = scheduleNext()
    return () => clearTimeout(timerRef)
  }, [spawnShootingStar])

  return (
    <div className="fixed inset-0 overflow-hidden z-0 pointer-events-none">
      {/* Star layers */}
      {starLayers.map((stars, layer) => (
        <div key={layer} className={`absolute inset-0 ${driftClasses[layer]}`}>
          {stars.map((star, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                top: star.top,
                left: star.left,
                width: `${star.size}px`,
                height: `${star.size}px`,
                backgroundColor: star.color,
                opacity: star.opacity,
                animation: `twinkle ${star.duration} ease-in-out ${star.delay} infinite alternate`,
                boxShadow: `0 0 ${star.glow}px ${star.color}`,
              }}
            />
          ))}
        </div>
      ))}

      {/* Shooting stars */}
      {shootingStars.map((s) => {
        const rad = s.angle * Math.PI / 180
        const dx = Math.cos(rad) * s.distance
        const dy = Math.sin(rad) * s.distance
        return (
          <div
            key={`shoot-${s.id}`}
            className="absolute shooting-star-anim"
            style={{
              top: s.top,
              left: s.left,
              width: `${s.length}px`,
              height: "1.5px",
              background: `linear-gradient(90deg, transparent, #ffffff 40%, #93c5fd)`,
              borderRadius: "999px",
              transform: `rotate(${s.angle}deg)`,
              boxShadow: "0 0 6px 1px rgba(147, 197, 253, 0.6)",
              "--shoot-dx": `${dx}px`,
              "--shoot-dy": `${dy}px`,
              "--shoot-duration": `${s.duration}s`,
            } as React.CSSProperties}
          />
        )
      })}
    </div>
  )
}
