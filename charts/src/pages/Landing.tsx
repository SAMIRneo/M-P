import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

function AnimatedGrid({ side, variant = 'tech' }: { side: 'left' | 'right', variant?: 'tech' | 'comic' }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = (t: number) => {
      const w = canvas.width / Math.min(2, window.devicePixelRatio || 1)
      const h = canvas.height / Math.min(2, window.devicePixelRatio || 1)
      ctx.clearRect(0, 0, w, h)

      const spacing = 60
      const cols = Math.ceil(w / spacing) + 1
      const rows = Math.ceil(h / spacing) + 1

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const px = x * spacing
          const py = y * spacing
          const dist = Math.sqrt((px - w / 2) ** 2 + (py - h / 2) ** 2)
          const wave = Math.sin(dist * 0.015 - t * 0.002) * 0.5 + 0.5
          
          ctx.beginPath()
          
          if (variant === 'comic') {
            // Halftone Style
            const size = 2 + wave * 4
            ctx.fillStyle = '#000000'
            // Draw somewhat sketchy dot? No, clean halftone is better for BD
            ctx.arc(px, py, size, 0, Math.PI * 2)
          } else {
            // Tech Style
            const alpha = 0.08 + wave * 0.12
            ctx.arc(px, py, 1.5 + wave * 1.5, 0, Math.PI * 2)
            if (side === 'left') {
              ctx.fillStyle = `rgba(37, 255, 212, ${alpha})`
            } else {
              ctx.fillStyle = `rgba(124, 108, 255, ${alpha})`
            }
          }
          ctx.fill()
        }
      }

      // Tech style gradients (only for tech variant)
      if (variant === 'tech') {
        for (let i = 0; i < 5; i++) {
          const phase = t * 0.001 + i * 1.2
          const px = w / 2 + Math.cos(phase) * (w * 0.3)
          const py = h / 2 + Math.sin(phase * 0.7) * (h * 0.3)
          const gradient = ctx.createRadialGradient(px, py, 0, px, py, 200)
          if (side === 'left') {
            gradient.addColorStop(0, 'rgba(37, 255, 212, 0.08)')
          } else {
            gradient.addColorStop(0, 'rgba(124, 108, 255, 0.08)')
          }
          gradient.addColorStop(1, 'transparent')
          ctx.fillStyle = gradient
          ctx.fillRect(0, 0, w, h)
        }
      }
      
      // Comic style action lines (only for comic variant)
      if (variant === 'comic') {
         // Maybe some subtle action lines or leave clean?
         // Let's keep it clean halftone for now
      }

      raf = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    raf = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [side, variant])

  return <canvas ref={canvasRef} className="landing-canvas" />
}

export function Landing() {
  const navigate = useNavigate()
  const [hoveredSide, setHoveredSide] = useState<'left' | 'right' | null>(null)

  return (
    <div className="landing-root">
      <div className="landing-container">
        <div
          className={`landing-side landing-left borderlands-mode ${hoveredSide === 'left' ? 'landing-side-hover' : ''} ${hoveredSide === 'right' ? 'landing-side-dimmed' : ''}`}
          onClick={() => navigate('/academy')}
          onMouseEnter={() => setHoveredSide('left')}
          onMouseLeave={() => setHoveredSide(null)}
        >
          <AnimatedGrid side="left" />
          <div className="landing-content">
            <div className="landing-icon landing-icon-left">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <h2 className="landing-title">Academy</h2>
            <p className="landing-subtitle">Maîtrisez les fondamentaux de la finance</p>
            <div className="landing-cta">
              <span className="landing-cta-text">Commencer</span>
              <svg className="landing-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          <div className="landing-glow landing-glow-left" />
        </div>

        <div className="landing-divider">
          <div className="landing-divider-line" />
          <div className="landing-logo">
            <div className="landing-logo-mark" />
            <span className="landing-logo-text">KBL</span>
          </div>
          <div className="landing-divider-line" />
        </div>

        <div
          className={`landing-side landing-right bd-mode ${hoveredSide === 'right' ? 'landing-side-hover' : ''} ${hoveredSide === 'left' ? 'landing-side-dimmed' : ''}`}
          onClick={() => navigate('/charts')}
          onMouseEnter={() => setHoveredSide('right')}
          onMouseLeave={() => setHoveredSide(null)}
        >
          <AnimatedGrid side="right" variant="comic" />
          <div className="landing-content">
            <div className="landing-icon landing-icon-right" style={{ 
              filter: 'drop-shadow(3px 3px 0 #000)',
              color: '#000'
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 3v18h18" />
                <path d="M18 9l-5 5-2-2-4 4" />
                <path d="M14 9h4v4" />
              </svg>
            </div>
            <h2 className="landing-title" style={{ fontFamily: '"Bangers", cursive', letterSpacing: '0.05em', textShadow: '2px 2px 0 #000' }}>Charts</h2>
            <p className="landing-subtitle" style={{ fontFamily: '"Comic Neue", cursive', fontWeight: 'bold', color: '#000' }}>Terminal de trading v.BD</p>
            <div className="landing-cta" style={{ background: '#fff', border: '2px solid #000', boxShadow: '3px 3px 0 #000' }}>
              <span className="landing-cta-text" style={{ fontFamily: '"Bangers", cursive', color: '#000' }}>Accéder</span>
              <svg className="landing-arrow" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          <div className="landing-glow landing-glow-right" style={{ background: 'radial-gradient(circle at center, var(--comic-cyan) 0%, transparent 70%)', opacity: 0.2 }} />
        </div>
      </div>

      <footer className="landing-footer">
        <span>KBL CHARTS</span>
        <span className="landing-footer-sep">•</span>
        <span>Terminal Comic Mode • temps réel</span>
      </footer>
    </div>
  )
}
