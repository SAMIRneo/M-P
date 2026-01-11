export type ConnectionState = 'connecting' | 'connected' | 'disconnected'

const BINANCE_REST = 'https://api.binance.com'
const BINANCE_WS = 'wss://stream.binance.com:9443/ws'

export function toWsSymbol(symbol: string) {
  return symbol.trim().toLowerCase()
}

export function buildWsUrl(stream: string) {
  return `${BINANCE_WS}/${stream}`
}

export async function binanceJson<T>(path: string, params: Record<string, string>, signal: AbortSignal): Promise<T> {
  const url = new URL(`${BINANCE_REST}${path}`)
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)

  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`Binance error ${res.status}`)
  return (await res.json()) as T
}

export function createReconnectingWs(
  url: string,
  onMessage: (data: unknown) => void,
  onState: (state: ConnectionState) => void,
) {
  let ws: WebSocket | null = null
  let closedByUser = false
  let retry = 0
  let retryTimer: number | null = null

  const connect = () => {
    if (closedByUser) return
    onState('connecting')
    ws = new WebSocket(url)

    ws.onopen = () => {
      retry = 0
      onState('connected')
    }

    ws.onmessage = (evt) => {
      try {
        onMessage(JSON.parse(String(evt.data)))
      } catch {
        onMessage(evt.data)
      }
    }

    ws.onclose = () => {
      ws = null
      if (closedByUser) return
      onState('disconnected')
      retry += 1
      const wait = Math.min(6000, 350 * 2 ** Math.min(retry, 4))
      retryTimer = window.setTimeout(connect, wait)
    }

    ws.onerror = () => {
      onState('disconnected')
    }
  }

  const close = () => {
    closedByUser = true
    onState('disconnected')
    if (retryTimer != null) window.clearTimeout(retryTimer)
    retryTimer = null
    ws?.close()
    ws = null
  }

  connect()

  return { close }
}

