import { useMemo, useState } from 'react'
import { formatPrice } from '../lib/format.ts'

export type TickerLite = {
  last: number
  changePct: number
}

export function Watchlist({
  symbols,
  activeSymbol,
  onSelect,
  tickers,
}: {
  symbols: readonly string[]
  activeSymbol: string
  onSelect: (symbol: string) => void
  tickers: Record<string, TickerLite | undefined>
}) {
  const [q, setQ] = useState('')
  const filtered = useMemo(() => {
    const query = q.trim().toUpperCase()
    if (!query) return symbols
    return symbols.filter((s) => s.includes(query))
  }, [q, symbols])

  return (
    <div className="kbl-pane">
      <div className="kbl-paneHeader">
        <div className="kbl-paneTitle">Watchlist</div>
        <div className="kbl-paneHint">clic pour changer</div>
      </div>

      <div className="kbl-paneToolbar">
        <input
          className="kbl-input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher…"
          aria-label="Rechercher un symbole"
        />
      </div>

      <div className="kbl-list" role="list">
        {filtered.map((s) => {
          const active = s === activeSymbol
          const t = tickers[s]
          const pct = t?.changePct
          const pctText = pct == null ? '—' : `${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%`
          const pctCls =
            pct == null ? 'kbl-chg' : pct >= 0 ? 'kbl-chg kbl-chgUp' : 'kbl-chg kbl-chgDn'
          return (
            <button
              key={s}
              type="button"
              className={active ? 'kbl-listRow kbl-listRowActive' : 'kbl-listRow'}
              onClick={() => onSelect(s)}
            >
              <span className="kbl-listSym">{s}</span>
              <span className="kbl-listMeta">
                <span className="kbl-price">{t ? formatPrice(t.last) : '—'}</span>
                <span className={pctCls}>{pctText}</span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
