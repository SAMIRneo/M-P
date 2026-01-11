import '../App.css'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { binanceJson, createReconnectingWs, toWsSymbol } from '../lib/binance.ts'
import { formatCompact, formatPrice } from '../lib/format.ts'
import { ChartView } from '../ui/ChartView.tsx'
import { ComicEffects } from '../ui/ComicEffects.tsx'
import { OrderBook } from '../ui/OrderBook.tsx'
import { TradesTape } from '../ui/TradesTape.tsx'
import { Watchlist, type TickerLite } from '../ui/Watchlist.tsx'

type ConnectionState = 'connecting' | 'connected' | 'disconnected'

type Ticker24hrRest = {
  symbol: string
  lastPrice: string
  priceChangePercent: string
  volume: string
  highPrice: string
  lowPrice: string
  bidPrice: string
  askPrice: string
}

type CombinedStream = {
  stream: string
  data: {
    e: string
    E: number
    s: string
    c: string
    P: string
    v: string
    h: string
    l: string
    b: string
    a: string
  }
}

export function Charts() {
  const navigate = useNavigate()
  const symbols = useMemo(
    () => ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT', 'ADAUSDT', 'DOGEUSDT', 'LINKUSDT'],
    [],
  )

  const intervals = useMemo(() => ['1m', '5m', '15m', '1h', '4h', '1d'] as const, [])

  const [symbol, setSymbol] = useState<string>('BTCUSDT')
  const [interval, setInterval] = useState<(typeof intervals)[number]>('1m')
  const [lastPrice, setLastPrice] = useState<number | null>(null)
  const [chartState, setChartState] = useState<ConnectionState>('connecting')
  const [tapeState, setTapeState] = useState<ConnectionState>('connecting')
  const [bookState, setBookState] = useState<ConnectionState>('connecting')
  const [tickerState, setTickerState] = useState<ConnectionState>('connecting')
  const [tickers, setTickers] = useState<Record<string, Ticker24hrRest | undefined>>({})
  const rafRef = useRef<number | null>(null)
  const pendingRef = useRef<Record<string, Ticker24hrRest>>({})

  const live =
    chartState === 'connected' ||
    tapeState === 'connected' ||
    bookState === 'connected' ||
    tickerState === 'connected'

  useEffect(() => {
    const ac = new AbortController()

    const applyPending = () => {
      rafRef.current = null
      const p = pendingRef.current
      pendingRef.current = {}
      setTickers((prev) => ({ ...prev, ...p }))
    }

    const schedule = (next: Ticker24hrRest) => {
      pendingRef.current[next.symbol] = next
      if (rafRef.current != null) return
      rafRef.current = requestAnimationFrame(applyPending)
    }

    const loadSnapshot = async () => {
      try {
        const payload = { symbols }
        const rows = await binanceJson<Ticker24hrRest[]>(
          '/api/v3/ticker/24hr',
          { symbols: JSON.stringify(payload.symbols) },
          ac.signal,
        )
        const map: Record<string, Ticker24hrRest> = {}
        for (const r of rows) map[r.symbol] = r
        setTickers(map)
      } catch {
        if (ac.signal.aborted) return
      }
    }

    void loadSnapshot()

    const streams = symbols.map((s) => `${toWsSymbol(s)}@ticker`).join('/')
    const url = `wss://stream.binance.com:9443/stream?streams=${streams}`
    const ws = createReconnectingWs(
      url,
      (raw) => {
        const msg = raw as CombinedStream
        const d = msg?.data
        if (!d?.s) return
        schedule({
          symbol: d.s,
          lastPrice: d.c,
          priceChangePercent: d.P,
          volume: d.v,
          highPrice: d.h,
          lowPrice: d.l,
          bidPrice: d.b,
          askPrice: d.a,
        })
      },
      setTickerState,
    )

    return () => {
      ws.close()
      ac.abort()
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      pendingRef.current = {}
    }
  }, [symbols])

  const activeTicker = tickers[symbol]
  const chg = activeTicker ? Number(activeTicker.priceChangePercent) : null
  const chgText = chg == null || !Number.isFinite(chg) ? '—' : `${chg >= 0 ? '+' : ''}${chg.toFixed(2)}%`
  const chgCls = chg == null ? 'kbl-statVal' : chg >= 0 ? 'kbl-statVal kbl-statUp' : 'kbl-statVal kbl-statDn'
  const vol = activeTicker ? Number(activeTicker.volume) : null
  const hi = activeTicker ? Number(activeTicker.highPrice) : null
  const lo = activeTicker ? Number(activeTicker.lowPrice) : null
  const volText = vol != null && Number.isFinite(vol) ? formatCompact(vol) : '—'
  const hiText = hi != null && Number.isFinite(hi) ? formatPrice(hi) : '—'
  const loText = lo != null && Number.isFinite(lo) ? formatPrice(lo) : '—'

  const liteTickers: Record<string, TickerLite | undefined> = useMemo(() => {
    const out: Record<string, TickerLite | undefined> = {}
    for (const s of symbols) {
      const t = tickers[s]
      if (!t) {
        out[s] = undefined
        continue
      }
      const last = Number(t.lastPrice)
      const changePct = Number(t.priceChangePercent)
      out[s] =
        Number.isFinite(last) && Number.isFinite(changePct)
          ? { last, changePct }
          : undefined
    }
    return out
  }, [symbols, tickers])

  return (
    <div className="kbl-root bd-mode">
      <div className="kbl-shell">
        <header className="kbl-topbar borderlands-panel" style={{ background: 'var(--comic-paper-cool)', borderRadius: 0, gridTemplateColumns: 'auto 1fr' }}>
          <div className="kbl-brand" style={{ paddingRight: 20, borderRight: '2px dashed #000' }}>
            <button className="kbl-backBtn comic-btn" style={{ transform: 'rotate(-2deg)', padding: '5px 12px', boxShadow: '3px 3px 0 #000', background: '#fff' }} onClick={() => navigate('/')} aria-label="Retour à l'accueil">
              HOME
            </button>
            <div className="kbl-brandMark" style={{ background: 'var(--comic-yellow)', borderRadius: 0, border: '2px solid #000', boxShadow: '3px 3px 0 #000', transform: 'rotate(2deg)' }} aria-hidden="true" />
            <div className="kbl-brandText">
              <div className="kbl-brandName comic-title" style={{ fontSize: '1.8rem', color: '#000', textShadow: '2px 2px 0 #fff', WebkitTextStroke: '0px', lineHeight: 1 }}>KBL CHARTS</div>
              <div className="kbl-brandTag" style={{ fontFamily: '"Comic Neue", cursive', fontWeight: 'bold', color: '#333', fontSize: '0.9rem' }}>TERMINAL TRADING v.BD</div>
            </div>
          </div>

          <div className="kbl-controls" style={{ gap: 16 }}>
            <div className="kbl-pill" style={{ background: 'var(--comic-cyan)', border: '2px solid #000', borderRadius: 0, boxShadow: '4px 4px 0 #000', transform: 'rotate(-1deg)' }}>
              <span className="kbl-pillLabel" style={{ fontFamily: '"Bangers", cursive', color: '#000', fontSize: '1.2rem', textShadow: '1px 1px 0 #fff' }}>MARKET</span>
              <select
                className="kbl-select"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                aria-label="Sélectionner un symbole"
                style={{ fontFamily: '"Comic Neue", cursive', fontWeight: 'bold', color: '#000', fontSize: '1.1rem' }}
              >
                {symbols.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="kbl-stats" aria-label="Statistiques 24h" style={{ background: '#fff', border: '2px solid #000', borderRadius: 0, boxShadow: '4px 4px 0 #000', transform: 'rotate(1deg)' }}>
              <div className="kbl-stat">
                <div className="kbl-statKey" style={{ fontFamily: '"Bangers", cursive', color: '#000', fontSize: '1.1rem' }}>24h</div>
                <div className={chgCls} style={{ fontFamily: '"Comic Neue", cursive', fontWeight: 'bold', fontSize: '1.1rem' }}>{chgText}</div>
              </div>
              <div className="kbl-stat" style={{ borderLeft: '2px dashed #ccc', paddingLeft: 8 }}>
                <div className="kbl-statKey" style={{ fontFamily: '"Bangers", cursive', color: '#666', fontSize: '1rem' }}>H</div>
                <div className="kbl-statVal" style={{ fontFamily: '"Comic Neue", cursive', fontWeight: 'bold', color: '#000' }}>{hiText}</div>
              </div>
              <div className="kbl-stat" style={{ borderLeft: '2px dashed #ccc', paddingLeft: 8 }}>
                <div className="kbl-statKey" style={{ fontFamily: '"Bangers", cursive', color: '#666', fontSize: '1rem' }}>L</div>
                <div className="kbl-statVal" style={{ fontFamily: '"Comic Neue", cursive', fontWeight: 'bold', color: '#000' }}>{loText}</div>
              </div>
              <div className="kbl-stat" style={{ borderLeft: '2px dashed #ccc', paddingLeft: 8 }}>
                <div className="kbl-statKey" style={{ fontFamily: '"Bangers", cursive', color: '#666', fontSize: '1rem' }}>Vol</div>
                <div className="kbl-statVal" style={{ fontFamily: '"Comic Neue", cursive', fontWeight: 'bold', color: '#000' }}>{volText}</div>
              </div>
            </div>

            <div className="kbl-seg" role="group" aria-label="Intervalle" style={{ background: 'transparent', border: 'none', gap: 6, padding: 0 }}>
              {intervals.map((i) => (
                <button
                  key={i}
                  className={i === interval ? 'kbl-segBtn kbl-segBtnActive' : 'kbl-segBtn'}
                  onClick={() => setInterval(i)}
                  type="button"
                  style={{ 
                    fontFamily: '"Bangers", cursive', 
                    border: '2px solid #000', 
                    background: i === interval ? 'var(--comic-magenta)' : '#fff',
                    color: i === interval ? '#fff' : '#000',
                    boxShadow: i === interval ? '2px 2px 0 #000' : '2px 2px 0 #ccc',
                    transform: i === interval ? 'translate(-1px, -1px) scale(1.1)' : 'none',
                    fontSize: '1rem',
                    borderRadius: 0,
                    padding: '4px 8px',
                    transition: 'all 0.1s'
                  }}
                >
                  {i}
                </button>
              ))}
            </div>

            <div className="kbl-live" aria-label={live ? 'Flux connecté' : 'Flux déconnecté'} style={{ background: live ? 'var(--comic-green)' : 'var(--comic-red)', border: '2px solid #000', borderRadius: 0, boxShadow: '4px 4px 0 #000', transform: 'rotate(-1deg)', marginLeft: 'auto' }}>
              <span className={live ? 'kbl-liveDot kbl-liveDotOn' : 'kbl-liveDot'} style={{ border: '2px solid #000', background: live ? '#fff' : '#000', width: 12, height: 12 }} />
              <span className="kbl-liveText" style={{ fontFamily: '"Bangers", cursive', color: '#000', fontSize: '1.2rem', textShadow: '1px 1px 0 rgba(255,255,255,0.5)' }}>{live ? 'LIVE' : 'OFF'}</span>
              <span className="kbl-livePrice" style={{ fontFamily: '"Comic Neue", cursive', fontWeight: '900', color: '#000', fontSize: '1.1rem' }}>{lastPrice == null ? '—' : lastPrice.toLocaleString()}</span>
            </div>
          </div>
        </header>

        <main className="kbl-grid">
          <aside className="kbl-panel kbl-panelLeft" aria-label="Watchlist">
            <Watchlist symbols={symbols} activeSymbol={symbol} onSelect={setSymbol} tickers={liteTickers} />
          </aside>

          <section className="kbl-panel kbl-panelCenter" aria-label="Graphique" style={{ position: 'relative' }}>
                  <ComicEffects lastPrice={lastPrice || 0} />
                  <ChartView
              symbol={symbol}
              interval={interval}
              onPrice={setLastPrice}
              onConnectionState={setChartState}
            />
          </section>

          <aside className="kbl-panel kbl-panelRight" aria-label="Carnet et trades">
            <div className="kbl-rightStack">
              <OrderBook symbol={symbol} onConnectionState={setBookState} />
              <TradesTape symbol={symbol} onConnectionState={setTapeState} />
            </div>
          </aside>
        </main>
      </div>
    </div>
  )
}
