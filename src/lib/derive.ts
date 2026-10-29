import type { Kategori } from '../content/types'
import { entriesOf, type LogEntry } from './logger'

/** Id kartu kosong "Manfaat versi kami". */
export const CUSTOM_BENEFIT_ID = 'versi-kami'

/** Elemen yang ada di kanvas setelah semua aksi sampai fase `maxPhase`. */
export function canvasAt(log: readonly LogEntry[], maxPhase = Infinity): Set<string> {
  const onCanvas = new Set<string>()
  for (const entry of log) {
    if (entry.phase > maxPhase) continue
    if (entry.action === 'element_found' || entry.action === 'element_placed') onCanvas.add(entry.payload.elementId)
    else if (entry.action === 'element_removed') onCanvas.delete(entry.payload.elementId)
  }
  return onCanvas
}

/** Petak tempat tiap elemen buatan berada. Elemen alam punya posisi tetap sehingga tidak masuk. */
export function placedCells(log: readonly LogEntry[]): Map<string, number> {
  const cells = new Map<string, number>()
  for (const entry of log) {
    if (entry.action === 'element_placed') cells.set(entry.payload.elementId, entry.payload.cell)
    else if (entry.action === 'element_removed') cells.delete(entry.payload.elementId)
  }
  return cells
}

/** Label terakhir. Kalau sudah dikunci, isi kunci yang dipakai. */
export function currentLabels(log: readonly LogEntry[]): Record<string, Kategori> {
  const locked = entriesOf(log, 'label_locked').at(-1)
  if (locked) return { ...locked.payload.labels }
  const labels: Record<string, Kategori> = {}
  for (const entry of entriesOf(log, 'label_changed')) {
    if (entry.payload.to) labels[entry.payload.elementId] = entry.payload.to
    else delete labels[entry.payload.elementId]
  }
  return labels
}

export function isLabelLocked(log: readonly LogEntry[]): boolean {
  return entriesOf(log, 'label_locked').length > 0
}

/** Berapa kali label tiap elemen diubah setelah pertama kali ditempel. */
export function labelChangeCounts(log: readonly LogEntry[]): Map<string, number> {
  const counts = new Map<string, number>()
  for (const entry of entriesOf(log, 'label_changed')) {
    if (entry.payload.from === null) continue
    counts.set(entry.payload.elementId, (counts.get(entry.payload.elementId) ?? 0) + 1)
  }
  return counts
}

/** Kartu manfaat yang masih menempel di tiap elemen, termasuk kartu versi kami. */
export function attachedBenefits(log: readonly LogEntry[]): Map<string, Set<string>> {
  const attached = new Map<string, Set<string>>()
  for (const entry of log) {
    if (entry.action !== 'benefit_attached' && entry.action !== 'benefit_detached') continue
    const { elementId, benefitId } = entry.payload
    const set = attached.get(elementId) ?? new Set<string>()
    if (entry.action === 'benefit_attached') set.add(benefitId)
    else set.delete(benefitId)
    attached.set(elementId, set)
  }
  return attached
}

export function completedPhases(log: readonly LogEntry[]): Set<number> {
  return new Set(entriesOf(log, 'phase_completed').map((entry) => entry.phase))
}
