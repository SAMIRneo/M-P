import { useEffect, useMemo, useRef, useState } from 'react'
import { binanceJson, createReconnectingWs, toWsSymbol, type ConnectionState } from '../lib/binance.ts'
import { formatPrice, formatQty } from '../lib/format.ts'

type DepthSnapshot = {
  lastUpdateId: number
  bids: [string, string][]
  asks: [string, string][]
}

type DepthPartial = {
  lastUpdateId: number
  bids: [string, string][]
  asks: [string, string][]
}

type Level = { price: number; qty: number }

function parseLevels(levels: [string, string][]) {
  const out: Level[] = []
  for (const [p, q] of levels) {
    const price = Number(p)
    const qty = Number(q)
    if (!Number.isFinite(price) || !Number.isFinite(qty)) continue
    if (qty <= 0) continue
    out.push({ price, qty })
  }
  return out
}

export function OrderBook({ symbol, onConnectionState }: { symbol: string; onConnectionState: (s: ConnectionState) => void }) {
  const [bids, setBids] = useState<Level[]>([])
  const [asks, setAsks] = useState<Level[]>([])
  const abortRef = useRef<AbortController | null>(null)
  const wsCloseRef = useRef<null | (() => void)>(null)
  const rafRef = useRef<number | null>(null)
  const pendingRef = useRef<{ bids: Level[]; asks: Level[] } | null>(null)

  const maxQty = useMemo(() => {
    let m = 0
    for (const l of bids) m = Math.max(m, l.qty)
    for (const l of asks) m = Math.max(m, l.qty)
    return m || 1
  }, [asks, bids])

  useEffect(() => {
    wsCloseRef.current?.()
    wsCloseRef.current = null
    abortRef.current?.abort()
    abortRef.current = null
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    pendingRef.current = null

    const ac = new AbortController()
    abortRef.current = ac

    const flush = () => {
      rafRef.current = null
      const p = pendingRef.current
      if (!p) return
      pendingRef.current = null
      setBids(p.bids)
      setAsks(p.asks)
    }

    const schedule = (next: { bids: Level[]; asks: Level[] }) => {
      pendingRef.current = next
      if (rafRef.current != null) return
      rafRef.current = requestAnimationFrame(flush)
    }

    const run = async () => {
      onConnectionState('connecting')
      try {
        const snap = await binanceJson<DepthSnapshot>('/api/v3/depth', { symbol, limit: '20' }, ac.signal)
        schedule({ bids: parseLevels(snap.bids).sort((a, b) => b.price - a.price), asks: parseLevels(snap.asks).sort((a, b) => a.price - b.price) })

        const stream = `${toWsSymbol(symbol)}@depth20@100ms`
        const ws = createReconnectingWs(
          `wss://stream.binance.com:9443/ws/${stream}`,
          (raw) => {
            const msg = raw as DepthPartial
            if (!msg?.bids || !msg?.asks) return
            const nb = parseLevels(msg.bids).sort((a, b) => b.price - a.price)
            const na = parseLevels(msg.asks).sort((a, b) => a.price - b.price)
            schedule({ bids: nb, asks: na })
          },
          onConnectionState,
        )
        wsCloseRef.current = ws.close
      } catch {
        if (ac.signal.aborted) return
        onConnectionState('disconnected')
      }
    }

    void run()

    return () => {
      wsCloseRef.current?.()
      wsCloseRef.current = null
      ac.abort()
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      pendingRef.current = null
    }
  }, [onConnectionState, symbol])

  return (
    <div className="kbl-pane">
      <div className="kbl-paneHeader">
        <div className="kbl-paneTitle">Order Book</div>
        <div className="kbl-paneHint">{symbol}</div>
      </div>

      <div className="kbl-ob">
        <div className="kbl-obCols">
          <div className="kbl-obH">Prix</div>
          <div className="kbl-obH">Qté</div>
        </div>

        <div className="kbl-obGrid">
          <div className="kbl-obSide kbl-obAsks" aria-label="Asks">
            {asks.slice(0, 12).map((l) => (
              <div key={l.price} className="kbl-obRow">
                <div className="kbl-obBar kbl-obBarAsk" style={{ width: `${(l.qty / maxQty) * 100}%` }} />
                <div className="kbl-obP kbl-obPAsk">{formatPrice(l.price)}</div>
                <div className="kbl-obQ">{formatQty(l.qty)}</div>
              </div>
            ))}
          </div>
          <div className="kbl-obSide kbl-obBids" aria-label="Bids">
            {bids.slice(0, 12).map((l) => (
              <div key={l.price} className="kbl-obRow">
                <div className="kbl-obBar kbl-obBarBid" style={{ width: `${(l.qty / maxQty) * 100}%` }} />
                <div className="kbl-obP kbl-obPBid">{formatPrice(l.price)}</div>
                <div className="kbl-obQ">{formatQty(l.qty)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
