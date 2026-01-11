import { useEffect, useMemo, useRef, useState } from 'react'
import { createReconnectingWs, toWsSymbol, type ConnectionState } from '../lib/binance.ts'
import { formatPrice, formatQty } from '../lib/format.ts'

type TradeWs = {
  e: 'trade'
  E: number
  s: string
  t: number
  p: string
  q: string
  T: number
  m: boolean
}

type TapeTrade = {
  price: number
  qty: number
  time: number
  side: 'buy' | 'sell'
}

export function TradesTape({ symbol, onConnectionState }: { symbol: string; onConnectionState: (s: ConnectionState) => void }) {
  const [trades, setTrades] = useState<TapeTrade[]>([])
  const wsCloseRef = useRef<null | (() => void)>(null)
  const rafRef = useRef<number | null>(null)
  const bufferRef = useRef<TapeTrade[]>([])

  const day = useMemo(() => new Date().toLocaleDateString(), [])

  useEffect(() => {
    wsCloseRef.current?.()
    wsCloseRef.current = null
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    bufferRef.current = []
    queueMicrotask(() => setTrades([]))

    const flush = () => {
      rafRef.current = null
      const buf = bufferRef.current
      if (buf.length === 0) return
      bufferRef.current = []
      setTrades((prev) => {
        const next = [...buf, ...prev]
        return next.slice(0, 40)
      })
    }

    const schedule = (t: TapeTrade) => {
      bufferRef.current.push(t)
      if (rafRef.current != null) return
      rafRef.current = requestAnimationFrame(flush)
    }

    const stream = `${toWsSymbol(symbol)}@trade`
    const ws = createReconnectingWs(
      `wss://stream.binance.com:9443/ws/${stream}`,
      (raw) => {
        const msg = raw as TradeWs
        const price = Number(msg.p)
        const qty = Number(msg.q)
        if (!Number.isFinite(price) || !Number.isFinite(qty)) return
        schedule({ price, qty, time: msg.T, side: msg.m ? 'sell' : 'buy' })
      },
      onConnectionState,
    )

    wsCloseRef.current = ws.close

    return () => {
      wsCloseRef.current?.()
      wsCloseRef.current = null
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      bufferRef.current = []
    }
  }, [onConnectionState, symbol])

  return (
    <div className="kbl-pane">
      <div className="kbl-paneHeader">
        <div className="kbl-paneTitle">Trades</div>
        <div className="kbl-paneHint">
          {symbol} • {day}
        </div>
      </div>

      <div className="kbl-tape">
        <div className="kbl-tapeHead">
          <div className="kbl-tapeH">Heure</div>
          <div className="kbl-tapeH">Prix</div>
          <div className="kbl-tapeH">Qté</div>
        </div>

        <div className="kbl-tapeBody" role="log" aria-label="Derniers trades">
          {trades.map((t, idx) => {
            const time = new Date(t.time).toLocaleTimeString(undefined, { hour12: false })
            const cls = t.side === 'buy' ? 'kbl-tapeRow kbl-tapeBuy' : 'kbl-tapeRow kbl-tapeSell'
            return (
              <div key={`${t.time}-${idx}`} className={cls}>
                <div className="kbl-tapeT">{time}</div>
                <div className="kbl-tapeP">{formatPrice(t.price)}</div>
                <div className="kbl-tapeQ">{formatQty(t.qty)}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
