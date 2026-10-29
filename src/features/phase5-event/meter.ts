import { konten as defaultKonten, type Konten } from '../../content'
import type { JenisTindakan } from '../../content/types'
import { entriesOf, type LogEntry } from '../../lib/logger'

/** Meter Kampung Sehat (design.md 7.9). Nilai awal dan dampak perlu divalidasi ahli materi. */
export const METER_AWAL = 40
export const DAMPAK: Record<JenisTindakan, number> = { tepat: 20, netral: -5, merusak: -15 }

const clamp = (n: number) => Math.max(0, Math.min(100, n))

export function jenisOf(eventId: string, actionId: string, k: Konten = defaultKonten): JenisTindakan | undefined {
  return k.kejadian.find((e) => e.id === eventId)?.tindakan.find((t) => t.id === actionId)?.jenis
}

/** Nilai meter dihitung ulang dari semua pilihan, termasuk percobaan ulang. */
export function healthMeter(log: readonly LogEntry[], k: Konten = defaultKonten): number {
  let value = METER_AWAL
  for (const e of entriesOf(log, 'event_action_chosen')) {
    const jenis = jenisOf(e.payload.eventId, e.payload.actionId, k)
    if (jenis) value = clamp(value + DAMPAK[jenis])
  }
  return value
}

export interface EventProgress {
  /** Tindakan yang sudah dicoba, berurutan. */
  tried: string[]
  /** Tindakan tepat yang dipilih, kalau sudah. */
  resolvedBy?: string
}

export function eventProgress(log: readonly LogEntry[], k: Konten = defaultKonten): Map<string, EventProgress> {
  const map = new Map<string, EventProgress>(k.kejadian.map((e) => [e.id, { tried: [] }]))
  for (const e of entriesOf(log, 'event_action_chosen')) {
    const p = map.get(e.payload.eventId)
    if (!p || p.resolvedBy) continue
    p.tried.push(e.payload.actionId)
    if (jenisOf(e.payload.eventId, e.payload.actionId, k) === 'tepat') p.resolvedBy = e.payload.actionId
  }
  return map
}
