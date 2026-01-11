import {
  CandlestickSeries,
  ColorType,
  createChart,
  type CandlestickData,
  type IChartApi,
  type ISeriesApi,
  type UTCTimestamp,
} from 'lightweight-charts'
import { useEffect, useMemo, useRef, useState } from 'react'
import { binanceJson, createReconnectingWs, toWsSymbol, type ConnectionState } from '../lib/binance.ts'
import { formatPrice } from '../lib/format.ts'

type KlineRest = [
  number,
  string,
  string,
  string,
  string,
  string,
  number,
  string,
  number,
  string,
  string,
  string,
]

type KlineWs = {
  e: 'kline'
  E: number
  s: string
  k: {
    t: number
    T: number
    s: string
    i: string
    f: number
    L: number
    o: string
    c: string
    h: string
    l: string
    v: string
    n: number
    x: boolean
    q: string
    V: string
    Q: string
    B: string
  }
}

function toCandle(k: KlineRest): CandlestickData<UTCTimestamp> {
  return {
    time: Math.floor(k[0] / 1000) as UTCTimestamp,
    open: Number(k[1]),
    high: Number(k[2]),
    low: Number(k[3]),
    close: Number(k[4]),
  }
}

function toCandleFromWs(msg: KlineWs): CandlestickData<UTCTimestamp> {
  return {
    time: Math.floor(msg.k.t / 1000) as UTCTimestamp,
    open: Number(msg.k.o),
    high: Number(msg.k.h),
    low: Number(msg.k.l),
    close: Number(msg.k.c),
  }
}

export function ChartView({
  symbol,
  interval,
  onPrice,
  onConnectionState,
}: {
  symbol: string
  interval: string
  onPrice: (last: number | null) => void
  onConnectionState: (state: ConnectionState) => void
}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)
  const wsCloseRef = useRef<null | (() => void)>(null)
  const abortRef = useRef<AbortController | null>(null)
  const [overlay, setOverlay] = useState<{ title: string; subtitle: string } | null>({
    title: 'Chargement…',
    subtitle: 'Synchronisation du marché',
  })
  const [localLast, setLocalLast] = useState<number | null>(null)

  const chartOptions = useMemo(
    () => ({
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#000000',
        fontFamily: '"Comic Neue", cursive',
      },
      grid: {
        vertLines: { color: 'rgba(0,0,0,0.1)' },
        horzLines: { color: 'rgba(0,0,0,0.1)' },
      },
      rightPriceScale: { borderColor: '#000000' },
      timeScale: { borderColor: '#000000' },
      crosshair: {
        vertLine: { color: '#000000', labelBackgroundColor: '#000000' },
        horzLine: { color: '#000000', labelBackgroundColor: '#000000' },
      },
      handleScroll: { mouseWheel: true, pressedMouseMove: true, horzTouchDrag: true, vertTouchDrag: false },
      handleScale: { axisPressedMouseMove: true, mouseWheel: true, pinch: true },
    }),
    [],
  )

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const chart = createChart(el, chartOptions)
    chartRef.current = chart

    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#86EFAC',
      downColor: '#FCA5A5',
      borderVisible: true,
      borderColor: '#000000',
      wickUpColor: '#000000',
      wickDownColor: '#000000',
    })
    seriesRef.current = series

    const ro = new ResizeObserver(() => {
      chart.applyOptions({ width: el.clientWidth, height: el.clientHeight })
      chart.timeScale().fitContent()
    })
    ro.observe(el)

    return () => {
      ro.disconnect()
      wsCloseRef.current?.()
      wsCloseRef.current = null
      abortRef.current?.abort()
      abortRef.current = null
      chart.remove()
      chartRef.current = null
      seriesRef.current = null
    }
  }, [chartOptions])

  useEffect(() => {
    const series = seriesRef.current
    const chart = chartRef.current
    if (!series || !chart) return

    wsCloseRef.current?.()
    wsCloseRef.current = null
    abortRef.current?.abort()
    abortRef.current = null

    const ac = new AbortController()
    abortRef.current = ac

    queueMicrotask(() => setOverlay({ title: 'Chargement…', subtitle: `${symbol} • ${interval}` }))
    onConnectionState('connecting')

    const run = async () => {
      try {
        const data = await binanceJson<KlineRest[]>(
          '/api/v3/klines',
          { symbol, interval, limit: '500' },
          ac.signal,
        )
        const candles = data.map(toCandle)
        series.setData(candles)
        chart.timeScale().fitContent()
        const last = candles.at(-1)?.close ?? null
        onPrice(last)
        setLocalLast(last)
        setOverlay(null)

        const stream = `${toWsSymbol(symbol)}@kline_${interval}`
        const ws = createReconnectingWs(
          `wss://stream.binance.com:9443/ws/${stream}`,
          (raw) => {
            const msg = raw as KlineWs
            if (!msg?.k) return
            const c = toCandleFromWs(msg)
            series.update(c)
            onPrice(c.close)
            setLocalLast(c.close)
          },
          onConnectionState,
        )
        wsCloseRef.current = ws.close
      } catch {
        if (ac.signal.aborted) return
        onConnectionState('disconnected')
        setOverlay({ title: 'Erreur', subtitle: 'Impossible de charger le flux' })
      }
    }

    void run()

    return () => {
      wsCloseRef.current?.()
      wsCloseRef.current = null
      ac.abort()
    }
  }, [interval, onConnectionState, onPrice, symbol])

  return (
    <div className="kbl-pane kbl-paneNoPad">
      <div className="kbl-paneHeader kbl-paneHeaderTight">
        <div className="kbl-paneTitle">Chart</div>
        <div className="kbl-paneHint">
          {symbol} • {interval}
        </div>
      </div>

      <div className="kbl-chartWrap">
        <div ref={containerRef} className="kbl-chart" />
        {overlay ? (
          <div className="kbl-overlay" role="status">
            <div className="kbl-overlayTitle">{overlay.title}</div>
            <div className="kbl-overlaySub">{overlay.subtitle}</div>
          </div>
        ) : null}
      </div>

      <div className="kbl-chartFooter">
        <div className="kbl-chip">
          <span className="kbl-chipK">Spread</span>
          <span className="kbl-chipV">—</span>
        </div>
        <div className="kbl-chip">
          <span className="kbl-chipK">Dernier</span>
          <span className="kbl-chipV">{localLast == null ? '—' : formatPrice(localLast)}</span>
        </div>
      </div>
    </div>
  )
}
