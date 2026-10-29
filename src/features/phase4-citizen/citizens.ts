import { konten as defaultKonten, type Konten } from '../../content'
import { canvasAt, placedCells } from '../../lib/derive'
import { entriesOf, type LogEntry } from '../../lib/logger'
import { canPlace, COLS, ROWS } from '../phase1-build/layout'

export interface CitizenStatus {
  /** Warga yang sudah terhubung ke elemen yang tepat. */
  linked: Map<string, string>
  /** Warga yang belum terhubung dan semua elemen yang dibutuhkannya belum ada di kanvas. */
  needsMissing: string[]
}

/** Keadaan Fase 4 dihitung dari log, sama seperti skor. */
export function citizenStatus(log: readonly LogEntry[], citizenIds: string[], k: Konten = defaultKonten): CitizenStatus {
  const tepat = new Map(k.warga.map((w) => [w.id, w.elemenTepat]))
  const linked = new Map<string, string>()
  for (const entry of entriesOf(log, 'citizen_linked')) {
    const { citizenId, elementId } = entry.payload
    if (!linked.has(citizenId) && tepat.get(citizenId)?.includes(elementId)) linked.set(citizenId, elementId)
  }
  const onCanvas = canvasAt(log)
  const needsMissing = citizenIds.filter(
    (id) => !linked.has(id) && !(tepat.get(id) ?? []).some((el) => onCanvas.has(el)),
  )
  return { linked, needsMissing }
}

export const isCorrectLink = (citizenId: string, elementId: string, k: Konten = defaultKonten) =>
  k.warga.find((w) => w.id === citizenId)?.elemenTepat.includes(elementId) ?? false

/** Petak sah pertama untuk elemen yang ditambah dari laci di Fase 4. */
export function firstFreeCell(elementId: string, log: readonly LogEntry[]): number | null {
  const occupied = new Set(placedCells(log).values())
  for (let cell = 0; cell < COLS * ROWS; cell++) if (canPlace(elementId, cell, occupied)) return cell
  return null
}
