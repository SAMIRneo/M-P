import { useEffect, useState, useRef } from 'react'

type EffectType = 'pow' | 'bam' | 'zap' | 'stonks' | 'rekt'

interface ComicEffect {
  id: number
  type: EffectType
  x: number
  y: number
  scale: number
  text: string
  rotation: number
  color: string
}

export function ComicEffects({ lastPrice }: { lastPrice: number }) {
  const [effects, setEffects] = useState<ComicEffect[]>([])
  const prevPriceRef = useRef(lastPrice)
  const effectIdRef = useRef(0)

  useEffect(() => {
    if (prevPriceRef.current === 0) {
      prevPriceRef.current = lastPrice
      return
    }

    const diff = lastPrice - prevPriceRef.current
    const pct = (diff / prevPriceRef.current) * 100
    prevPriceRef.current = lastPrice

    if (Math.abs(pct) > 0.05) { // Threshold for effect
      const type = pct > 0 ? (pct > 0.2 ? 'stonks' : 'zap') : (pct < -0.2 ? 'rekt' : 'pow')
      const text = type === 'stonks' ? 'STONKS!' : type === 'rekt' ? 'REKT!' : type === 'zap' ? 'ZAP!' : 'POW!'
      const color = pct > 0 ? '#86EFAC' : '#FCA5A5'
      
      const newEffect: ComicEffect = {
        id: effectIdRef.current++,
        type,
        x: Math.random() * 60 + 20, // Random position 20-80%
        y: Math.random() * 60 + 20,
        scale: 0.5 + Math.random() * 0.5,
        text,
        rotation: Math.random() * 30 - 15,
        color
      }

      setEffects(prev => [...prev, newEffect])

      // Cleanup
      setTimeout(() => {
        setEffects(prev => prev.filter(e => e.id !== newEffect.id))
      }, 1000)
    }
  }, [lastPrice])

  return (
    <div className="comic-effects-overlay" style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      overflow: 'hidden',
      zIndex: 50
    }}>
      {effects.map(effect => (
        <div key={effect.id} className="comic-bubble" style={{
          position: 'absolute',
          left: `${effect.x}%`,
          top: `${effect.y}%`,
          transform: `translate(-50%, -50%) rotate(${effect.rotation}deg) scale(${effect.scale})`,
          background: '#fff',
          border: '3px solid #000',
          padding: '1rem',
          boxShadow: '4px 4px 0 #000',
          fontFamily: '"Bangers", cursive',
          fontSize: '2rem',
          color: '#000',
          animation: 'pop-in-out 1s ease-out forwards',
          whiteSpace: 'nowrap'
        }}>
          <div style={{
            position: 'absolute',
            inset: -5,
            border: `2px dashed ${effect.color}`,
            zIndex: -1,
            transform: 'rotate(-2deg)'
          }} />
          {effect.text}
        </div>
      ))}
      <style>{`
        @keyframes pop-in-out {
          0% { transform: translate(-50%, -50%) scale(0) rotate(0deg); opacity: 0; }
          20% { transform: translate(-50%, -50%) scale(1.2) rotate(${Math.random() * 10 - 5}deg); opacity: 1; }
          80% { transform: translate(-50%, -50%) scale(1) rotate(${Math.random() * 10 - 5}deg); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(0.8) rotate(0deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
