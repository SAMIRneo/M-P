export function clamp01(v: number) {
  return Math.max(0, Math.min(1, v))
}

export function formatCompact(n: number) {
  return Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 2 }).format(n)
}

export function formatPrice(n: number) {
  if (!Number.isFinite(n)) return '—'
  const abs = Math.abs(n)
  const decimals = abs >= 1000 ? 2 : abs >= 1 ? 4 : 6
  return Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: decimals }).format(n)
}

export function formatQty(n: number) {
  if (!Number.isFinite(n)) return '—'
  const abs = Math.abs(n)
  const decimals = abs >= 1 ? 4 : 6
  return Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: decimals }).format(n)
}

